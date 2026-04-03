from __future__ import annotations
import json
import logging
from langchain.agents import AgentExecutor, create_react_agent
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate, ChatPromptTemplate, MessagePlaceholder
from langchain.tools import StructuredTool
from langchain_openai import ChatOpenAI
from langchain.output_parsers import PydanticOutputParser, RetryWithErrorOutputParser
from langchain.chains import LLMChain
from app.services.chroma_client import get_chroma_collection
from app.core import settings
from app.schemas.document import (
    JobMatcher,
    VectorSearchInput,
    JobMatchInput,
    RewriteSectionInput,
    CeleryDispatchInput,
)
from app.agents import prompts
from app.worker.tasks import resume_tailor


logger = logging.getLogger(__name__)


class ResumeCopilot:
    def __init__(self, user_id: str, session_id: str, doc_id: str):
        self.user_id = user_id
        self.doc_id = doc_id
        self.session_id = session_id
        self.llm = ChatOpenAI(model=settings.OPENAI_MODEL, temperature=0.3)
        self.job_matcher_parser = PydanticOutputParser.from_llm(
            pydantic_object=JobMatcher
        )
        self.job_matcher_retry_parser = RetryWithErrorOutputParser.from_llm(
            llm=self.llm, parser=self.job_matcher_parser, max_retries=3
        )
        self.job_matcher_prompt = PromptTemplate(
            input_variables=["resume_chunks", "job_description"],
            partial_variables={
                "format_instructions": self.job_matcher_parser.get_format_instructions()
            },
            template="""
            You are a senior technical recruiter
            
            Resume Content:
            {resume_chunks}
            
            Job Description:
            {job_description}
            
            Return format:
            {format_instructions}
            """,
        )
        self.job_matcher_chain = LLMChain(llm=self.llm, prompt=self.job_matcher_prompt)
        self.memory_manager = ConversationBufferWindowMemory(
            memory_key=f"chat_history", k=10, return_messages=True
        )

    async def vector_search(self, query: str, top_k: int = 5) -> str:
        try:
            resume_collection = await get_chroma_collection(
                name=settings.CHROMA_COLLECTION
            )
            results = await resume_collection.query(
                query_texts=[query],
                n_results=top_k,
                where={"user_id": self.user_id, "document_id": self.doc_id},
            )
            docs = results.get("documents", [])
            chunks = docs[0] if docs else []
            if not chunks or len(chunks) == 0:
                return "No resume content found for this user"

            return "\n\n---\n\n".join(
                f"[Chunk {i+1}]\n{c}" for i, c in enumerate(chunks)
            )
        except Exception as e:
            logger.error(f"An error occured while retrieving chunks, Error\n{str(e)}")
            raise e

    async def job_matcher(self, job_description: str) -> JobMatcher:
        try:
            resume_chunks = await self.vector_search(query=job_description, top_k=10)

            raw_output = await self.job_matcher_chain.ainvoke(
                {"resume_chunks": resume_chunks, "job_description": job_description}
            )
            text_output = (
    raw_output.get("text")
    if isinstance(raw_output, dict)
    else raw_output
)

            return self.job_matcher_retry_parser.parse_with_prompt(
                text_output,
                self.job_matcher_prompt.format(
                    resume_chunks=resume_chunks,
                    job_description=job_description,
                ),
            )
        except Exception as e:
            logger.error(
                f"An error occured while in job matcher routing, Error:\n{str(e)}"
            )
            raise e

    async def rewrite_section(
        self, section_text: str, job_description: str, tone: str = "professional"
    ) -> str:
        try:
            prompt = f"""
            You are an expert resume rewriter. Rewrite the section below to be more impactful and tailored to the job description.
            
            Tone:
            {tone}
            
            Original_section:
            {section_text}
            
            Job description:
            {job_description}
            
            Return only the rewritten section text, No explanations, No questions
            """
            response = await self.llm.apredict(prompt)
            return response
        except Exception as e:
            logger.error(
                f"An error occured while rewriting resume section, Error\n{str(e)}"
            )
            raise e

    def celery_dispatch(self, task_name: str, payload: dict):
        try:
            TASK_MAP = {
                "export_resume_pdf": resume_tailor.export_pdf,
                "send_resume_email": resume_tailor.send_email,
                "generate_cover_letter": resume_tailor.generate_cover_letter,
            }
            safe_tasks = [
                "export_resume_pdf",
                "send_resume_email",
                "generate_cover_letter",
            ]

            if task_name not in safe_tasks:
                return json.dumps(
                    {
                        "success": False,
                        "task_id": None,
                        "status": f"Task '{task_name}' is not in the allowed list: {safe_tasks}",
                    }
                )

            task_func = TASK_MAP[task_name]

            task = task_func.delay(
                user_id=self.user_id, document_id=self.doc_id, payload=payload
            )
            return json.dumps({"success": True, "task_id": task.id, "status": "queued"})
        except Exception as e:
            logger.error(f"Celery dispatch ran into an error, Error:\n{str(e)}")
            raise e

    def create_agent_executor(self) -> AgentExecutor:
        tools = [
            StructuredTool.from_function(
                func=self.vector_search,
                name="VectorSearch",
                description=(
                    "Search the user's resume vectorstore. Use this first to ground your "
                    "answers in the actual resume content before analysing or rewriting."
                ),
                args_schema=VectorSearchInput,
            ),
            StructuredTool.from_function(
                func=self.job_matcher,
                name="JobMatcher",
                description=(
                    "Score the user's resume against a job description. "
                    "Returns match_score, matched_skills, missing_skills, and a top recommendation."
                ),
                args_schema=JobMatchInput,
            ),
            StructuredTool.from_function(
                func=self.rewrite_section,
                name="RewriteSection",
                description=(
                    "Rewrite a specific resume section (summary, experience bullet, skills) "
                    "to be more impactful and aligned with a target job description."
                ),
                args_schema=RewriteSectionInput,
            ),
            StructuredTool.from_function(
                func=self.celery_dispatch,
                name="CeleryDispatch",
                description=(
                    "Dispatch an async background task: export_resume_pdf, send_resume_email, or generate_cover_letter, Once the resume tailoring is complete."
                ),
                args_schema=CeleryDispatchInput,
            ),
        ]

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", prompts.REACT_TEMPLATE),
                MessagePlaceholder(variable_name="chat_history"),
                ("human", "{input}"),
                ("ai", "{agent_scratchpad}"),
            ]
        )
        agent = create_react_agent(
            llm=self.llm, tools=tools, prompt=prompt.partial(user_id=self.user_id)
        )

        return AgentExecutor(
            agent=agent,
            tools=tools,
            memory=self.memory_manager,
            verbose=True,
            max_iterations=10,
            handle_parsing_errors=True,
            return_intermediate_steps=True,
            early_stopping_method="generate"
        )

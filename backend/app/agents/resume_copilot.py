from __future__ import annotations
import json
import logging
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate, ChatPromptTemplate, MessagePlaceholder
from langchain.tools import StructuredTool
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser, PydanticOutputParser
from langchain.output_parsers import RetryWithErrorOutputParser
from app.services.chroma_client import get_chroma_collection
from app.core import settings
from app.schemas.document import (
    JobMatcher,
    VectorSearchInput,
    JobMatchInput,
    CeleryDispatchInput,
    ParsedResume,
    TailorResumeInput,
)
from app.agents import prompts
from app.worker.tasks import resume_tailor
from app.models.Document import Documents

logger = logging.getLogger(__name__)


class ResumeCopilot:
    def __init__(self, user_id: str, session_id: str, doc_id: str):
        self.user_id = user_id
        self.doc_id = doc_id
        self.session_id = session_id
        self.llm = ChatOpenAI(model=settings.OPENAI_MODEL, temperature=0.3)
        self.job_matcher_parser = PydanticOutputParser(pydantic_object=JobMatcher)
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
        self.job_matcher_chain = (
            self.job_matcher_prompt
            | self.llm
            | StrOutputParser()
            | self.job_matcher_retry_parser
        )
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

    async def job_matcher(self, job_description: str) -> str:
        try:
            resume_chunks = await self.vector_search(query=job_description, top_k=10)

            result = await self.job_matcher_chain.ainvoke(
                {"resume_chunks": resume_chunks, "job_description": job_description}
            )
            return f"""
            Match Score: {result.match_score}
            Matched Skills: {', '.join(result.matched_skills)}
            Missing Skills: {', '.join(result.missing_skills)}
            Recommendation: {result.top_recommendations}
            """
        except Exception as e:
            logger.error(
                f"An error occured while in job matcher routing, Error:\n{str(e)}"
            )
            raise e

    async def fetch_resume_json(self) -> str:
        try:
            resume_data: ParsedResume = await Documents.find_one(
                {"user_id": self.user_id, "doc_id": self.doc_id},
                {"_id": 0, "parsed_resume": 1},
            )
            if not resume_data:
                return json.dumps({"error": "No parsed resume found for this document"})
            return json.dumps(resume_data["parsed_resume"], indent=2)
        except Exception as e:
            logger.error(
                f"An error occured while fetching parsed resume details, Error:\n{str(e)}"
            )
            raise e

    async def tailor_resume_json(
        self, job_description: str, tone: str = "professional"
    ) -> str:
        try:
            resume_json_str = await self.fetch_resume_json()
            resume_data = json.loads(resume_json_str)
            if "error" in resume_data:
                return resume_json_str

            parser = PydanticOutputParser(pydantic_object=ParsedResume)
            retry_parser = RetryWithErrorOutputParser.from_llm(
                llm=self.llm, parser=parser, max_retries=3
            )

            messages = [
                {"role": "system", "content": prompts.TAILOR_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": (
                        f"Tone: {tone}\n\n"
                        f"Job Description:\n{job_description}\n\n"
                        f"Resume JSON:\n{json.dumps(resume_data, indent=2)}"
                    ),
                },
            ]
            chain = self.llm | StrOutputParser() | retry_parser

            response = await chain.ainvoke(messages)
            return json.dumps(response.dict(), indent=2)
        except Exception as e:
            logger.error(
                f"An error occured while tailoring the resume, Error: {str(e)}"
            )
            raise e

    def celery_dispatch(self, task_name: str, payload: dict):
        try:
            SAFE_TASKS = {
                "export_resume_pdf": resume_tailor.export_pdf,
                "send_resume_email": resume_tailor.send_email,
                "generate_cover_letter": resume_tailor.generate_cover_letter,
            }

            if task_name not in SAFE_TASKS:
                return json.dumps(
                    {
                        "success": False,
                        "task_id": None,
                        "status": f"Task '{task_name}' is not in the allowed list: {list(SAFE_TASKS)}",
                    }
                )

            task = SAFE_TASKS[task_name].delay(
                user_id=self.user_id, document_id=self.doc_id, payload=payload
            )
            return json.dumps({"success": True, "task_id": task.id, "status": "queued"})
        except Exception as e:
            logger.error(f"Celery dispatch ran into an error, Error:\n{str(e)}")
            raise e

    def create_agent_executor(self) -> AgentExecutor:
        tools = [
            StructuredTool(
                name="VectorSearch",
                description=(
                    "Search the user's resume vector store for relevant chunks. "
                    "Use this for quick lookups or to answer questions about the resume."
                ),
                args_schema=VectorSearchInput,
                coroutine=self.vector_search,
            ),
            StructuredTool(
                name="JobMatcher",
                description=(
                    "Analyse how well the resume matches a job description. "
                    "Returns match_score, matched_skills, missing_skills, and a top recommendation. "
                    "Call this before TailorResumeJSON if you want to surface the gap report to the user."
                ),
                args_schema=JobMatchInput,
                coroutine=self.job_matcher,
            ),
            StructuredTool(
                name="TailorResumeJSON",
                description=(
                    "Fetch the full structured resume from the database and rewrite it end-to-end "
                    "to be tailored to the given job description. "
                    "Returns the tailored resume as a JSON string. "
                    "Always call this as the primary tailoring step – do NOT use RewriteSection "
                    "for piecemeal edits when the goal is a full tailored resume."
                ),
                args_schema=TailorResumeInput,
                coroutine=self.tailor_resume_json,
            ),
            StructuredTool(
                name="CeleryDispatch",
                description=(
                    "Dispatch a background task after tailoring is complete. "
                    "Supported tasks: export_resume_pdf, send_resume_email, generate_cover_letter. "
                    "Pass the tailored resume JSON inside `payload`."
                ),
                args_schema=CeleryDispatchInput,
                func=self.celery_dispatch,  # sync – keep as func=
            ),
        ]

        prompt = ChatPromptTemplate.from_messages([
                ("system", prompts.TAILORING_AGENT_TEMPLATE),
                MessagePlaceholder(variable_name="chat_history"),
                ("human", "{input}")
            ])
        agent = create_tool_calling_agent(
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
            early_stopping_method="generate",
        )

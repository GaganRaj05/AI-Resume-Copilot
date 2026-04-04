from __future__ import annotations
import json
import logging
from fastapi import Request
from langchain_classic.agents import create_tool_calling_agent
from langchain_classic.agents import AgentExecutor
from langchain_core.prompts import (
    PromptTemplate,
    ChatPromptTemplate,
    MessagesPlaceholder,
)
from langchain_classic.tools import StructuredTool
from langchain_openai import ChatOpenAI

from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core import StorageContext
from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter, FilterCondition


from app.services.chroma_client import get_chroma_collection_sync
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
from app.worker.tasks import resume_tasks
from app.models.Document import Documents

logger = logging.getLogger(__name__)

llm = ChatOpenAI(model=settings.OPENAI_MODEL)
job_matcher_llm = llm.with_structured_output(JobMatcher)
job_matcher_prompt = PromptTemplate(
    input_variables=["Resume", "job_description"],
    template="""
            You are a senior technical recruiter currently analysing the user's resume against the job description.
            
            Resume Content:
            {Resume}
            
            Job Description:
            {job_description}
                        
            Return JSON as per the schema.
            """,
)
job_matcher_chain = job_matcher_prompt | job_matcher_llm
tailor_resume_llm_structured = llm.with_structured_output(ParsedResume)

tailor_resume_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", prompts.TAILOR_RESUME_CHAIN_PROMPT),
        (
            "human",
            "Tone: {tone}\n\nJob Description:\n{job_description}\n\nResume JSON:\n{resume_json}",
        ),
    ]
)


tailor_resume_chain = tailor_resume_prompt | tailor_resume_llm_structured

from pydantic import BaseModel
class NoInput(BaseModel):
    pass

class ResumeCopilot:
    def __init__(self, user_id: str, doc_id: str):
        self.user_id = user_id
        self.doc_id = doc_id
        self.job_description = ""
        

    async def vector_search(self, query: str, top_k: int = 5) -> str:
        try:
            resume_collection = get_chroma_collection_sync(
                name=settings.CHROMA_COLLECTION
            )
            vector_store = ChromaVectorStore(chroma_collection=resume_collection)
            storage_context = StorageContext.from_defaults(vector_store=vector_store)

            index = VectorStoreIndex.from_vector_store(
                vector_store, 
                storage_context=storage_context
            )
            filters = MetadataFilters(
                            filters=[
                                ExactMatchFilter(key="user_id", value=self.user_id),
                                ExactMatchFilter(key="document_id", value=self.doc_id),
                            ],
                            condition=FilterCondition.AND
                        )


            retriever = index.as_retriever(
                        similarity_top_k=top_k,
                        filters=filters
                    )

            nodes = retriever.retrieve(query)

            if not nodes:
                return "No resume content found for this user"

            chunks = [node.node.get_content() for node in nodes]
        
            return "\n\n---\n\n".join(
                f"[Chunk {i+1}]\n{c}" for i, c in enumerate(chunks)
            )
        except Exception as e:
            logger.error(f"An error occured while retrieving chunks, Error\n{str(e)}")
            raise e

    async def job_matcher(self) -> str:
        try:
            resume_chunks = await self.fetch_resume_json()

            result = await job_matcher_chain.ainvoke(
                {"Resume": resume_chunks, "job_description": self.job_description}
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
            doc = await Documents.find_one(
                Documents.user_id == self.user_id, Documents.doc_id == self.doc_id
            )

            if not doc or not doc.parsed_resume:
                return json.dumps({"error": "No parsed resume found for this document"})

            return json.dumps(doc.parsed_resume.model_dump(), indent=2)

        except Exception as e:
            logger.error(
                f"Error fetching parsed resume | user_id={self.user_id}, doc_id={self.doc_id} | {str(e)}",
                exc_info=True,
            )
            raise

    async def tailor_resume_json(
        self, tone: str = "professional"
    ) -> str:
        try:
            resume_json_str = await self.fetch_resume_json()
            resume_data = json.loads(resume_json_str)
            if "error" in resume_data:
                return resume_json_str

            response = await tailor_resume_chain.ainvoke(
                {
                    "tone": tone,
                    "job_description": self.job_description,
                    "resume_json": json.dumps(resume_data, indent=2),
                }
            )
            return json.dumps(response.model_dump(), indent=2)
        except Exception as e:
            logger.error(
                f"An error occured while tailoring the resume, Error: {str(e)}"
            )
            raise e

    def celery_dispatch(
        self, task_name: str, payload: ParsedResume
    ):
        try:
            SAFE_TASKS = {
                "process_tailored_resume": resume_tasks.process_tailored_resume,
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
                user_id=self.user_id,
                document_id=self.doc_id,
                payload=payload.model_dump(),
                job_description=self.job_description,
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
                    "Search the user's resume vector store for relevant chunks to be added "
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
                args_schema = NoInput,
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
                    "Pass the tailored resume JSON inside `payload`."
                ),
                args_schema=CeleryDispatchInput,
                func=self.celery_dispatch,
            ),
        ]

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", prompts.TAILOR_SYSTEM_PROMPT),
                ("human", "{input}"),
                MessagesPlaceholder(variable_name="agent_scratchpad"),
            ]
        )
        agent = create_tool_calling_agent(
            llm=llm, tools=tools, prompt=prompt.partial(user_id=self.user_id)
        )

        return AgentExecutor(
            agent=agent,
            tools=tools,
            verbose=True,
            max_iterations=10,
            handle_parsing_errors=True,
            return_intermediate_steps=True,
            early_stopping_method="generate",
        )

    async def run(self, job_description: str):
        try:
            self.job_description = job_description
            agent = self.create_agent_executor()
            result = await agent.ainvoke({"input": job_description})
            return result
        except Exception as e:
            logger.error(
                f"An error occured while generating agent response, Error:\n{str(e)}"
            )
            raise e

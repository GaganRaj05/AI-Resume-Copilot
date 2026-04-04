from app.agents.prompts import RESUME_PARSING_PROMPT
from app.schemas.document import ParsedResume
from app.core import settings

import logging

from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

logger = logging.getLogger(__name__)

llm = ChatOpenAI(
    model=settings.OPENAI_MODEL,
    temperature=0
)

structured_llm = llm.with_structured_output(ParsedResume)


extracted_resume_prompt = PromptTemplate(
    input_variables=["information"],
    template=RESUME_PARSING_PROMPT,
)

extraction_chain = (
    extracted_resume_prompt
    | structured_llm
)

async def parse_resume(resume_txt: str) -> ParsedResume:
    try:
        result = await extraction_chain.ainvoke({
            "information": resume_txt[:12000] 
        })
        return result

    except Exception as e:
        logger.error(
            f"Resume parsing service ran into an error:\n{str(e)}"
        )
        raise
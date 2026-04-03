from app.agents.prompts import RESUME_PARSING_PROMPT
from app.schemas.document import ParsedResume
from app.core import settings

import logging

from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

from langchain_core.output_parsers import StrOutputParser, PydanticOutputParser
from langchain.output_parsers import RetryWithErrorOutputParser

logger = logging.getLogger(__name__)

llm = ChatOpenAI(
    model=settings.OPENAI_MODEL,
    temperature=0
)

extracted_resume_parser = PydanticOutputParser(
    pydantic_object=ParsedResume
)

extracted_resume_prompt = PromptTemplate(
    input_variables=["information"],
    partial_variables={
        "format_instructions": extracted_resume_parser.get_format_instructions(),
    },
    template=RESUME_PARSING_PROMPT,
)

extracted_resume_retry_parser = RetryWithErrorOutputParser.from_llm(
    llm=llm,
    parser=extracted_resume_parser,
    max_retries=3
)

extraction_chain = (
    extracted_resume_prompt
    | llm
    | StrOutputParser()
    | extracted_resume_retry_parser
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
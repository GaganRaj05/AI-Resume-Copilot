from app.agents.prompts import RESUME_PARSING_PROMPT
from app.schemas.document import ParsedResume
from app.core import settings
import logging
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.output_parsers import PydanticOutputParser, RetryWithErrorOutputParser
import asyncio

logger = logging.getLogger(__name__)

llm = ChatOpenAI(model=settings.OPENAI_MODEL, temperature=0)
extracted_resume_parser = PydanticOutputParser(pydantic_object=ParsedResume)
extracted_resume_prompt = PromptTemplate(
    input_variables=["information"],
    partial_variables={
        "format_instructions": extracted_resume_parser.get_format_instructions(),
    },
    template=RESUME_PARSING_PROMPT,
)
extracted_resume_retry_parser = RetryWithErrorOutputParser.from_llm(
    llm=llm, parser=extracted_resume_parser, max_retries=3
)
extraction_chain = LLMChain(
    llm=llm,
    prompt=extracted_resume_prompt,
)


async def parse_resume(resume_txt: str) -> ParsedResume:
    try:
        raw_output = await extraction_chain.ainvoke({"information": resume_txt})
        text_output = (
            raw_output["text"] if isinstance(raw_output, dict) else str(raw_output)
        )
        if not text_output:
            raise ValueError("LLM returned empty output")
        prompt_value = extracted_resume_prompt.format(
            information=resume_txt[:12000],
            format_instructions=extracted_resume_parser.get_format_instructions(),
        )
        return await asyncio.get_running_loop().run_in_executor(
            None,
            extracted_resume_retry_parser.parse_with_prompt,
            text_output,
            prompt_value,
        )

    except Exception as e:
        logger.error(f"Resume parsing service ran into an error, Error:\n{str(e)}")
        raise e

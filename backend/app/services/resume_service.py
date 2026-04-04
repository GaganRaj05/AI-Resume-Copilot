from bson import ObjectId
import logging
import json
from datetime import datetime

from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import os
import tempfile
from pymongo import ReturnDocument


from app.models.User import User
from app.models.TailoredResume import TailoredResumes
from app.schemas.document import  CoverLetter, ParsedResume
from app.core import settings

logger = logging.getLogger(__name__)

llm = ChatOpenAI(model=settings.OPENAI_MODEL, temperature = 0)

cover_letter_structured = llm.with_structured_output(CoverLetter)

cover_letter_generation_prompt = PromptTemplate(
    input_variables = ["parsed_resume", "job_description"],
    
    template = """
    You are Cover Letter Generator.
    
    Generate cover letter using infromation from the resume and Job Description.
    
    Resume:
    {parsed_resume}
    
    Job Description:
    {job_description}
    
    Return Strict JSON as per the schema
    Rules
    - Do not hallucinate
    - If missing, return None
    - Keep bullets concise
    """
    
)



cover_letter_generator_chain = (
    cover_letter_generation_prompt
    | cover_letter_structured
)



async def generate_pdf(payload: dict):
    try:
        env = Environment(loader=FileSystemLoader("templates"))
        template = env.get_template("resume.html")

        html_content = template.render(
            summary=payload.get("summary"),
            skills=payload.get("skills", []),
            experience=payload.get("experience", []),
            education=payload.get("education", [])
        )

        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        HTML(string=html_content).write_pdf(temp_file.name)

        return temp_file.name 

    except Exception as e:
        logger.error("Error generating PDF")
        raise e


async def send_tailored_resume(user_id: str, payload: dict):
    try:
        if not user_id or not payload:
            raise ValueError("User Id or Payload is None")
        
        user = await User.find_one({"_id":ObjectId(user_id)}) 
        if not user:
            raise Exception("No user found")
        generated_pdf = await generate_pdf(payload=payload)
        
        logger.info(f"Pdf couldn't be sent via email as domain cannot be configured at the moment")
    except Exception as e:
        raise e
    
async def save_tailored_resume(user_id: str, document_id: str, payload: dict, job_description: str):
    try:
        if not user_id or not payload or not document_id:
            raise ValueError("User Id or Payload is None")

        parsed_resume_obj = ParsedResume.model_validate(payload)

        await TailoredResumes.find_one_and_update(
            {
                "user_id": user_id,
                "document_id": document_id
            },
            {
                "$set": {
                    "parsed_resume": parsed_resume_obj,
                    "job_description": job_description
                },
                "$setOnInsert": {
                    "user_id": user_id,
                    "document_id": document_id,
                    "file_name": "resume.pdf"
                }
            },
            upsert=True,
            return_document=ReturnDocument.AFTER
        )

        logger.info(f"Resume upserted successfully | user_id={user_id}")

    except Exception as e:
        logger.error(
            f"Error saving resume | user_id={user_id} | {str(e)}",
            exc_info=True
        )
        raise
        
async def generate_cover_letter(user_id:str, document_id:str):
    try:
        parsed_resume = await TailoredResumes.find_one({"user_id":user_id, "document_id": document_id})
        if not parsed_resume:
            raise Exception("No resume found")
        result = await cover_letter_generator_chain.ainvoke({
            "parsed_resume":json.dumps(parsed_resume.parsed_resume.model_dump(), indent=2),
            "job_description": parsed_resume.job_description
        })
        parsed_resume.cover_letter = result.cover_letter
        await parsed_resume.save()
        return result
    except Exception as e:
        logger.error(
            f"Error generating cover letter for document id: {document_id} | {str(e)}",
            exc_info=True
        )
        raise e
    


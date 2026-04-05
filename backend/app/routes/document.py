from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from app.core import settings
from app.worker.tasks import document_processing
from app.worker.celery_app import celery_app
from pathlib import Path
from app.models.Document import Documents
import uuid
import shutil
import logging
from typing import Any
from pypdf import PdfReader
from app.services.resume_parser import parse_resume
from app.schemas.document import ResumeTailorRequestInput, CoverLetterRequest
from app.agents.resume_copilot import ResumeCopilot
from app.services.resume_service import generate_cover_letter
import asyncio
logger = logging.getLogger(__name__)

router = APIRouter()

def validate_file(file:UploadFile)->None:
    suffix = Path(file.filename).suffix.lower()
    if suffix not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=422, detail={"success":False, "msg":"Unsupported file format"})


def extract_text(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text
 
def save_upload(user_id:str,file:UploadFile) -> tuple[str, Path]:
    doc_id = str(uuid.uuid4())
    suffix = Path(file.filename).suffix.lower()
    dest: Path = settings.UPLOAD_DIR / f"{user_id}{doc_id}{suffix}"
    
    with dest.open("wb") as out:
        shutil.copyfileobj(file.file, out)
    
    size = dest.stat().st_size
    if size > settings.MAX_FILE_BYTES:
        dest.unlink(missing_ok=True)
        raise HTTPException(
            status_code=413,
            detail= {"success":False, "msg":"File exceeds size limit"}
        )

    return doc_id, dest

@router.post("/upload")
async def upload_file(user_id:str, file: UploadFile = File(...)):
    try:
        validate_file(file = file)
        doc_id, saved_path = save_upload(user_id=user_id, file=file)
        
        extracted_text = await asyncio.get_event_loop().run_in_executor(None, extract_text, saved_path)
        parsed = await parse_resume(extracted_text)

        document = Documents(
            user_id = user_id,
            doc_id = doc_id,
            original_name = file.filename,
            parsed_resume = parsed
        )
        await document.insert()
        
        
        task = document_processing.process_document.delay(
            user_id=user_id,
            doc_id=doc_id,
            file_path = str(saved_path),
            original_filename = file.filename,
        )
        return {"success":True, "msg":"File uploaded successfully", "data":{"doc_id":doc_id, "file_name":file.filename, "task_id":task.id}}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File Upload route ran into an error, Error:\n{str(e)}")
        raise HTTPException(status_code = 500, detail = {"success":False, "msg":"Server error"})
    
@router.get("/status/{task_id}", summary="Poll Celery task status")
def task_status(task_id: str) -> dict[str, Any]:
    try:
        result = celery_app.AsyncResult(task_id)
 
        response: dict[str, Any] = {"task_id": task_id, "status": result.status}
    
        if result.successful():
            response["result"] = result.result
        elif result.failed():
            response["error"] = str(result.result)  # exception string
        elif result.status == "PROGRESS":
            response["progress"] = result.info  # dict sent via update_state()
    
        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"An error occured while fetching task status, Error:\n{str(e)}")
        raise HTTPException(status_code = 500, detail = {"success":False, "msg":"Server Error"})


@router.post("/tailor-resume")
async def tailor_resume(data: ResumeTailorRequestInput):
    try:
        copilot = ResumeCopilot(
            user_id=data.user_id,
            doc_id=data.doc_id,
        )
        last_message = None
        messages = None
        result = await copilot.run(job_description=data.job_description)
        
        if isinstance(result, dict) and "messages" in result:
            messages = result["messages"]
            # FIX: Use .content instead of ["content"]
            last_message = messages[-1].content if messages else None
            
            output = last_message
        else: 
            output = str(result)

        if not output:
            raise HTTPException(
                status_code=500,
                detail={
                    "success": False,
                    "msg": "Agent produced no output"
                }
            )

        return {
            "output": output,
            "intermediate_steps": messages 
        }

    except HTTPException:
        raise

    except Exception as e:
        logger.error(
            f"Error tailoring resume for {data.doc_id}: {str(e)}"
        )
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "msg": "Server error"
            }
        )   
@router.post("/generat-cover-letter")
async def process_cover_letter(data: CoverLetterRequest):
    try:
        result = await generate_cover_letter(user_id=data.user_id, document_id=data.document_id)
        return {"success":True, "msg":"Cover Letter generated successfully","result":result} 
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"An error occured while generating cover letter, Error: {str(e)}")
        raise HTTPException(status_code = 500, detail = {"success":False, "msg":"Server Error"})
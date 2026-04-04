from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional
from app.schemas.document import ParsedResume

class TailoredResumes(Document):
    user_id:str = Field(...)
    document_id:str = Field(..., unique = True)
    created_at: datetime = Field(default_factory = datetime.utcnow)
    parsed_resume:ParsedResume
    job_description:Optional[str]=None
    cover_letter:Optional[str] = None

    class Settings:
        name = "TailoredResumes"
        indexes = ["user_id", "document_id"]    
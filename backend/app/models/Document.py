from beanie import Document
from pydantic import Field 
from datetime import datetime
from app.schemas.document import ParsedResume

class Documents(Document):
    user_id:str = Field(...)
    doc_id:str = Field(..., unique=True)
    orginal_name:str
    created_at:datetime =Field(default_factory = datetime.utcnow)
    parsed_resume:ParsedResume
    class Settings:
        name = "Documents"
        indexes = ["user_id", "doc_id"]

    
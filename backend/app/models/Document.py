from beanie import Document
from pydantic import Field 
from datetime import datetime

class Documents(Document):
    user_id:str = Field(...)
    doc_id:str = Field(..., unique=True)
    original_name:str
    created_at:datetime =Field(default_factory = datetime.utcnow)
    
    class Settings:
        name = "Documents"
        indexes = ["user_id", "doc_id"]

    
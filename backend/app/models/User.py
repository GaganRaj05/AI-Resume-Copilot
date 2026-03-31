from beanie import Document, before_event, Insert, Replace
from typing import Optional
from datetime import datetime
from enum import Enum
from pydantic import Field, BaseModel


class AuthProvider(str, Enum):
    GOOGLE = "google"
    EMAIL = "email"
    

class User(Document):
    name:str
    email:str = Field(..., unique=True)
    auth_provider:AuthProvider
    google_id:Optional[str] = None
    created_at:datetime = Field(default_factory=datetime.utcnow)
    updated_at:Optional[datetime] = None
    password: Optional[str] = None
    
    class Settings:
        name = "Users"
        indexes = ["email", "id"]
    
    @before_event([Insert, Replace])
    def update_timestamp(self):
        self.updated_at = datetime.utcnow()
        

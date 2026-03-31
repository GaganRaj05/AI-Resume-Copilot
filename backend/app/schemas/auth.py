from pydantic import BaseModel, EmailStr, model_validator
from typing import Optional
from enum import Enum

class AuthProvider(str, Enum):
    GOOGLE = "google"
    EMAIL = "email"
    
class UserSignUp(BaseModel):
    email:Optional[EmailStr] = None
    password: Optional[str] = None
    google_token: Optional[str] = None
    auth_provider:AuthProvider
    
    @model_validator(mode="after")
    def validate_auth(self):
        if self.auth_provider=="google" and not self.google_token:
            raise ValueError("google_id is required for Google auth")
        if self.auth_provider == "email" and not self.password:
            raise ValueError("password is required for Email auth")
        
class GoogleAuth(BaseModel):
    google_token:str
    
class UserSignIn(BaseModel):
    email:EmailStr
    password: str

class EmailVerification(BaseModel):
    email:EmailStr
    otp:str


    
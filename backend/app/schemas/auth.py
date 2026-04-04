from pydantic import BaseModel, EmailStr, model_validator, Field
from typing import Optional
from enum import Enum


class AuthProvider(str, Enum):
    GOOGLE = "google"
    EMAIL = "email"
    
class UserSignUp(BaseModel):
    name: str = Field(..., min_length=5, description="Name Text")
    email: EmailStr = Field(...)
    auth_provider: AuthProvider
    password: str = Field(..., min_length=8)
    

class GoogleAuth(BaseModel):
    google_token:str
    
class UserSignIn(BaseModel):
    email:EmailStr
    password: str

class EmailVerification(BaseModel):
    email:EmailStr
    otp:str


    
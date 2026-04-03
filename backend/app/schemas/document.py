from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
class DocumentProcessing(BaseModel):
    user_id:str
    document_id:str
    original_filename:str
    num_pages:int
    num_chunks:int
    collection:str
    embed_model:str
    
class VectorSearchInput(BaseModel):
    query:str = Field(..., description = "Natural-language query about the resume")
    top_k:int = Field(5, description = "Number of chunks to retrieve")
    
class JobMatchInput(BaseModel):
    job_description: str = Field(..., description="Full text of the target job posting")

class RewriteSectionInput(BaseModel):
    section_text: str = Field(..., description="The resume section to improve")
    job_description: str = Field(..., description="Target job posting for tailoring")
    tone: str = Field("professional", description="e.g. professional / concise / technical")

class CeleryDispatchInput(BaseModel):
    task_name: str = Field(..., description="Celery task to dispatch, e.g. export_resume_pdf")
    payload: dict = Field(default_factory=dict)
    
class JobMatcher(BaseModel):
    match_score:int = Field(..., description="Job Match score range between 0-100")
    matched_skills:List[str] =Field(..., description="List of matched skills from user's resume that matches the job description.")
    missing_skills:List[str] = Field(..., description = "List of missing skills that is required in the job description.")
    top_recommendations:str = Field(..., description="A sentence describing what the user should add to improve his/her chances of getting an interview")
    
class Experience(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    duration: Optional[str] = None
    bullets: List[str] = []


class Education(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class ParsedResume(BaseModel):
    summary: Optional[str] = None
    skills: List[str] = []
    experience: List[Experience] = []
    education: List[Education] = []
    
class TailorResumeInput(BaseModel):
    job_description: str = Field(description="The full job description to tailor the resume against")
    tone: str = Field(default="professional", description="Writing tone: professional | confident | concise")

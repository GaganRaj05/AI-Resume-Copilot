from pydantic import BaseModel

class DocumentProcessing(BaseModel):
    user_id:str
    document_id:str
    original_filename:str
    num_pages:int
    num_chunks:int
    collection:str
    embed_model:str
    
import os
from dotenv import load_dotenv
from pathlib import Path
load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
MONGODB_URL = os.getenv('MONGODB_URL')
MONGODB_NAME = os.getenv('MONGODB_NAME')
OPENAI_MODEL = os.getenv('OPENAI_MODEL')
REDIS_URL = os.getenv("REDIS_URL")
FRONTEND_URL = os.getenv('FRONTEND_URL')
ALGORITHM = os.getenv('ALGORITHM')
SECRET_KEY = os.getenv("SECRET_KEY")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

EMBED_MODEL = os.getenv("EMBED_MODEL", "text-embedding-3-small")


BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR/"uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = [".pdf",".doc",".docx"]
MAX_FILE_SIZE = 10
MAX_FILE_BYTES = MAX_FILE_SIZE * 1024 * 1024

CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL

CHUNK_SIZE = int(os.getenv('CHUNK_SIZE',"512"))
CHUNK_OVERLAP = 64

CHROMA_HOST = os.getenv("CHROMA_HOST")
CHROMA_PORT = os.getenv("CHROMA_PORT")
CHROMA_COLLECTION = os.getenv("CHROMA_COLLECTION", "resumes")

CHROMA_PERSIST_DIR = str(BASE_DIR/"chroma_db")

os.environ["G_MESSAGES_DEBUG"] = "none"
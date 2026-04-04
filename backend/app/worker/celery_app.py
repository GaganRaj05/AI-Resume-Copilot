from celery import Celery
from app.core import settings
from celery.signals import worker_init
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models import(
    User,
    Document,
    TailoredResume
)
import asyncio
import logging
from app.core.async_runner import set_loop

async def startup_db():
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        await init_beanie(
            database= client[settings.MONGODB_NAME],
            document_models= [
                User.User,
                Document.Documents,
                TailoredResume.TailoredResumes
            ]
        )
        logger.info("MongoDB connection successful")
    except Exception as e:
        logger.error("An error occured while connecting to MongoDB")
        logger.error(f"Error: {str(e)}")
        raise e

logger = logging.getLogger(__name__)
@worker_init.connect
def init_worker(**kwargs):
    try:
        logger.info("Initializing DB for Celery worker...")

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        set_loop(loop)  

        loop.run_until_complete(startup_db())
        logger.info("DB initialized successfully.")

    except Exception:
        logger.exception("DB initialization failed!")    
celery_app = Celery(
    "document_processor",
    broker = settings.CELERY_BROKER_URL,
    backend = settings.CELERY_RESULT_BACKEND,
    include = ["app.worker.tasks.document_processing","app.worker.tasks.resume_tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_acks_late=True,              
    task_reject_on_worker_lost=True,   
    worker_prefetch_multiplier=1,      
    result_expires=86_400,             
)

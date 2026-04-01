from celery import Celery
from app.core import settings

celery_app = Celery(
    "document_processor",
    broker = settings.CELERY_BROKER_URL,
    backend = settings.CELERY_RESULT_BACKEND,
    include = ["tasks"]
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
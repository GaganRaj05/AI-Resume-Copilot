from celery import Task, shared_task, group
from app.services.resume_service import send_tailored_resume, save_tailored_resume
import logging
import asyncio
logger = logging.getLogger(__name__)

@shared_task(
    bind = True,
    name = "tasks.resume_tailor",
    autoretry_for = (Exception,),
    retry_backoff = 120,
    retry_backoff_max = 480,
    max_retries = 3,
    dont_autoretry_for = (ValueError, )
)
def process_tailored_resume(self, user_id:str, document_id:str, payload:dict, job_description:str):
    try:

        job = group(
            send_email.s(
                user_id = user_id,
                payload = payload
            ),
            save_to_db.s(
                user_id = user_id,
                document_id = document_id,
                payload = payload,
                job_description = job_description
            ),
        )
        
        result = job.apply_async()
        logger.info(f"Pipeline dispatched for user {user_id}, group_id={result.id}")
        return {"success": True, "group_id": result.id}
    except Exception as e:
        raise
    
@shared_task(bind=True, max_retries=3, default_retry_delay=10)
def send_email(self, user_id: str, payload: dict):
    try:
        asyncio.run(send_tailored_resume(user_id=user_id, payload=payload))
        logger.info(f"Resume emailed to user {user_id}")
    except Exception as exc:
        raise self.retry(exc=exc)
 
@shared_task(bind=True, max_retries=3, default_retry_delay=10)
def save_to_db(self, user_id: str, document_id: str, payload: dict, job_description:str):
    try:
        asyncio.run(save_tailored_resume(user_id=user_id, document_id=document_id, payload=payload, job_description=job_description))
        logger.info(f"Resume pushed to frontend for user {user_id}")
    except Exception as exc:
        raise self.retry(exc=exc)


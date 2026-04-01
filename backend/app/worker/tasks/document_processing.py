import logging
from pathlib import Path

from celery import Task
from celery_app import celery_app
from pipeline import run_pipeline

logger = logging.getLogger(__name__)

class ProcessDocument(Task):
    asbstract = True
    
@celery_app.task(
    bin = True,
    base = ProcessDocument,
    name = "tasks.process_document",
    autoretry_for = (Exception,),
    retry_backoff = 120,
    retry_backoff_maz = 480,
    max_retries = 3,
    dont_autoretry_for = (FileNotFoundError, ValueError)
)
def process_document(
    self, 
    user_id:str,
    doc_id:str,
    file_path:str,
    original_filename:str
) -> dict:
    logger.info("[%s] Task started | file=%s", doc_id, file_path)
    
    def _update(step:str, pct:int):
        self.update_state(
            state = "PROGRESS",
            meta = {"step":step, "percent":pct}
        )
    
    try:
        result = run_pipeline(
            user_id=user_id,
            doc_id = doc_id,
            file_path = file_path,
            orginal_filename = original_filename,
            progress_callback = _update
        )
        logger.info("[%s] Task completed | chunks=%d", doc_id, result["num_chunks"])
        return result
    except(FileNotFoundError, ValueError) as exc:
        logger.error("[%s] Permanent failure: %s", doc_id, exc)
        raise 
    
    except Exception as exc:
        logger.warning("[%s] Transient failure (attempt %d/%d): %s", doc_id, self.request.retries+1, self.max_retries+1, exc )
        raise
    

    
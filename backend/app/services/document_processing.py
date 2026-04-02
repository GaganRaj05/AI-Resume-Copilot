import logging 
import chromadb
from pathlib import Path
from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    StorageContext,
)
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
from llama_index.vector_stores.chroma import ChromaVectorStore
from app.core import settings
from app.services.chroma_client import get_chroma_collection
from app.core.config import configure_llama
from app.schemas.document import DocumentProcessing
from llama_index.readers.file import PDFReader, DocxReader

logger = logging.getLogger(__name__)


def _emit(callback, step:str, pct:int):
    if callback:
        callback(step=step, pct=pct)
        
def _get_file_extractor(suffix: str) -> dict: 
    extractors = {
        ".pdf": PDFReader(),
        ".docx": DocxReader(),
        ".doc": DocxReader(),   
    }
    return {suffix: extractors[suffix]}


def run_pipeline(
    user_id:str,
    doc_id:str,
    file_path:str, 
    original_filename:str,
    progress_callback = None,
) -> DocumentProcessing:
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"File not found:{file_path}")

    suffix = path.suffix.lower()
    if suffix not in settings.ALLOWED_EXTENSIONS:
        raise ValueError(f"Unsupported file type: {suffix}")
    
    _emit(progress_callback, "Configuring embedding model", 5)
    configure_llama()    

    _emit(progress_callback, "Loading document", 15) 
    logger.info("[%s] Loading file: %s", doc_id, file_path)
    
    reader = SimpleDirectoryReader(
        input_files = [str(path)],
        file_extractor = _get_file_extractor(suffix)
    )
    
    documents = reader.load_data()
    logger.info("[%s] Loaded %d document page(s)", doc_id, len(documents))

    for doc in documents:
        doc.metadata.update(
            {
                "user_id":user_id,
                "document_id":doc_id,
            }
        )
    
    _emit(progress_callback, "Splitting into chunks", 35)
    splitter = SentenceSplitter(
        chunk_size = settings.CHUNK_SIZE,
        chunk_overlap = settings.CHUNK_OVERLAP,
        paragraph_seperator = "\n\n"
    )        
    nodes = splitter.get_nodes_from_documents(documents)
    
    logger.info("[%s] Created %d chunk(s)", doc_id, len(nodes))

    if not nodes:
        raise ValueError("Document produced zero chunks — it may be empty or image-only.")

    _emit(progress_callback, "Connecting to vector store", 50)
    collection = get_chroma_collection()
    vector_store = ChromaVectorStore(chroma_collection=collection)
    storage_ctx = StorageContext.from_defaults(vector_store=vector_store)
    
    _emit(progress_callback, "Embedding and indexing chunks", 65)
    logger.info("[%s] Embedding %d nodes …", doc_id, len(nodes))

    VectorStoreIndex(
        nodes = nodes,
        storage_context = storage_ctx,
        show_progress = False
    )
    _emit(progress_callback, "Done", 100)
    logger.info("[%s] Indexing complete.", doc_id)
    
    return DocumentProcessing(
        user_id=user_id,
        document_id = doc_id,
        original_filename = original_filename,
        num_pages = len(documents),
        num_chunks = len(nodes),
        collection = settings.CHROMA_COLLECTION,
        embed_model = settings.EMBED_MODEL
    )


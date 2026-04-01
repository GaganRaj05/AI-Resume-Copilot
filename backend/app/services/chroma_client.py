from chromadb import AsyncHttpClient
import logging
from fastapi import FastAPI, Request
from app.core.settings import CHROMA_HOST, CHROMA_PORT, CHROMA_COLLECTION
logger = logging.getLogger(__name__)


async def init_async_chroma_client(app:FastAPI):
    try:
        app.state.chroma_client = await AsyncHttpClient(
            host = CHROMA_HOST,
            port = CHROMA_PORT
        )
        await app.state.chroma_client.heartbeat()
        logger.info(f"Chroma client iniitialised successfully")
    except Exception as e:
        logger(f"An error occured while initialising chroma client, Error:\n{str(e)}")
        raise e
        

async def get_async_chroma_client(request:Request):
    try:
        if not hasattr(request.app.state, "chroma_client") or request.app.state.chroma_client is None:
            logger.warning("Chroma Client not initialised, Attempting initialisation")
            await init_async_chroma_client(request.app)
        
        return request.app.state.chroma_client
    except Exception as e:
        logger.error(f"An error occurred while accessing chroma client: {str(e)}")
        raise e    
    
async def close_chroma_client(app:FastAPI):
    if hasattr(app.state, "chroma_client") and app.state.chroma_client:
        try:
            if hasattr(app.state.chroma_client, 'close'):
                await app.state.chroma_client.close()
            elif hasattr(app.state.chroma_client, '_session'):
                await app.state.chroma_client._session.close()
            logger.info("Chroma client closed successfully")
        except Exception as e:
            logger.error(f"An error occurred while closing chroma client, Error:\n{str(e)}")
    else:
        logger.error("No Chroma client to close")
    
async def get_chroma_collection(request:Request):
    try:
        client = await get_async_chroma_client(request=request)
        
        return await client.get_or_create_collection(
            name = CHROMA_COLLECTION,
            metadata={"hnsw:space": "cosine"},
        )
    except Exception as e:
        logger.error(f"An error occured while accessing chroma collection, Error:\n{str(e)}")
        raise e
    
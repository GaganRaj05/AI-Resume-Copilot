import redis.asyncio as redis
from fastapi import FastAPI, Request
from app.core.settings import REDIS_URL
import logging

logger = logging.getLogger(__name__)

async def init_redis_pool(app:FastAPI):
    try:
        app.state.redis = redis.from_url(
            REDIS_URL,
            decode_responses=True,
            max_connections=20,
            socket_timeout=5,
            socket_connect_timeout=6,
            retry_on_timeout=True,
        )
        
        await app.state.redis.ping()
        logger.info(f"Redis connection successfull")
    except Exception as e:
        logger.error(
            f"An error occured while establishing the connection with redis:\n {str(e)}"
        )
        raise e

async def get_redis(request:Request):
    try:
        if not hasattr(request.app.state, "redis"):
            logger.warning(f"Redis connection not yet established, Attempting connection")
            await init_redis_pool(request.app)
        return request.app.state.redis
    except Exception as e:
        logger.error(f"An error occured while re-using the redis session:\n{str(e)}")
        raise e

async def close_redis_connection_pool(app:FastAPI):
    try:
        await app.state.redis.close()
        logger.info(f"Redis connection closed successfully")
    except Exception as e:
        logger.error(f"An error occured while closing redis connection:\n{str(e)}")
        raise e

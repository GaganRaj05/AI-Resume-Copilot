from app.core.settings import MONGODB_NAME, MONGODB_URL
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.User import User
from fastapi import FastAPI
logger = logging.getLogger(__name__)


async def startup_db(app:FastAPI):
    try:
        app.state.mongo_client = AsyncIOMotorClient(MONGODB_URL)
        await init_beanie(
            database= app.state.mongo_client[MONGODB_NAME],
            document_models= [
                User,
            ]
        )
        logger.info("MongoDB connection successful")
    except Exception as e:
        logger.error("An error occured while connecting to MongoDB")
        logger.error(f"Error: {str(e)}")
        raise e
        
async def close_db_connection(app:FastAPI):
    try:
        if hasattr(app.state, "mongo_client"):
            app.state.mongo_client.close()
            logger.info("MongoDB connection closed successfully")
    except Exception as e:
        logger.error("An error occurred while closing MongoDB connection")
        logger.error(f"Error: {str(e)}")
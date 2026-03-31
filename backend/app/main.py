from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.settings import FRONTEND_URL
from app.core.logging_config import setup_logging
from app.services.db import startup_db, close_db_connection
from app.services.redis import init_redis_pool, close_redis_connection_pool
from app.routes import auth
setup_logging()

@asynccontextmanager
async def lifespan(app:FastAPI):
    await startup_db(app)
    await init_redis_pool(app)
    yield
    await close_db_connection()
    await close_redis_connection_pool(app)

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_methods=["GET","POST","PUT","PATCH","DELETE"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth")


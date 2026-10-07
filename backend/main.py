from fastapi import FastAPI
from contextlib import asynccontextmanager
import uvicorn
import os

from core.database import init_db
from routes import analyze
from dotenv import load_dotenv

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

load_dotenv()
app = FastAPI(title="Soundbyte", lifespan=lifespan)
app.include_router(analyze.router)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
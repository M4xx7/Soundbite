from fastapi import FastAPI
from contextlib import asynccontextmanager
import uvicorn

from backend.core.database import init_db
from backend.routes import analyze
from dotenv import load_dotenv

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

load_dotenv()
app = FastAPI(title="Voice Analyzer API", lifespan=lifespan)
app.include_router(analyze.router)

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
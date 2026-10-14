import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from main import app
from core.database import Base
from services.JobManager import JobStatus

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
test_engine = create_async_engine(TEST_DATABASE_URL, echo=False, future=True)
TestSessionLocal = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)


@pytest_asyncio.fixture(autouse=True)
async def setup_database(monkeypatch):
    import services.JobManager as jm_module
    monkeypatch.setattr(jm_module, "AsyncSessionLocal", TestSessionLocal)

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
def client():
    return TestClient(app)


def test_submit_audio_job(client):
    response = client.post(
        "/jobs/submit",
        files={"file": ("test_audio.mp3", b"fake audio content", "audio/mpeg")}
    )

    assert response.status_code == 202
    data = response.json()
    assert "job_id" in data
    assert data["status"] == JobStatus.PENDING


def test_get_job_status_not_found(client):
    response = client.get("/jobs/nonexistent_id")

    assert response.status_code == 404
    assert response.json()["detail"] == "Job not found"
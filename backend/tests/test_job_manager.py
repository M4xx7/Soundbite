import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from core.database import Base
from services.JobManager import JobManager, JobStatus

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


@pytest.mark.asyncio
async def test_create_job():
    manager = JobManager()
    job_id = await manager.create_job()

    assert isinstance(job_id, str)
    assert len(job_id) > 0

    job = await manager.get_job(job_id)
    assert job["status"] == JobStatus.PENDING
    assert job["result"] is None
    assert job["error"] is None


@pytest.mark.asyncio
async def test_update_job_success():
    manager = JobManager()
    job_id = await manager.create_job()

    result_payload = {"summary": "Great podcast", "topics": ["tech"]}
    await manager.update_job(job_id, JobStatus.COMPLETED, result=result_payload)

    job = await manager.get_job(job_id)
    assert job["status"] == JobStatus.COMPLETED
    assert job["result"] == result_payload
    assert job["error"] is None


@pytest.mark.asyncio
async def test_get_job_not_found():
    manager = JobManager()
    job = await manager.get_job("nonexistent_id")

    assert job["status"] == JobStatus.NOT_FOUND
    assert job["result"] is None
    assert job["error"] is None
import uuid
import json
from typing import Dict, Any, Optional
from enum import Enum
from sqlalchemy import select

from backend.models.job_model import JobModel
from backend.core.database import AsyncSessionLocal


class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    NOT_FOUND = "not_found"


class JobManager:
    async def create_job(self) -> str:
        job_id = uuid.uuid4().hex
        async with AsyncSessionLocal() as session:
            db_job = JobModel(
                job_id=job_id,
                status=JobStatus.PENDING,
                result_payload=None,
                error_message=None
            )
            session.add(db_job)
            await session.commit()
        return job_id

    async def update_job(
            self,
            job_id: str,
            status: JobStatus,
            result: Optional[Dict[str, Any]] = None,
            error: Optional[str] = None
    ):
        async with AsyncSessionLocal() as session:
            result_query = await session.execute(
                select(JobModel).where(JobModel.job_id == job_id)
            )
            db_job = result_query.scalar_one_or_none()

            if db_job:
                db_job.status = status
                if result is not None:
                    db_job.result_payload = json.dumps(result)
                if error is not None:
                    db_job.error_message = error
                await session.commit()

    async def get_job(self, job_id: str) -> Dict[str, Any]:
        async with AsyncSessionLocal() as session:
            result_query = await session.execute(
                select(JobModel).where(JobModel.job_id == job_id)
            )
            db_job = result_query.scalar_one_or_none()

            if not db_job:
                return {
                    "status": JobStatus.NOT_FOUND,
                    "result": None,
                    "error": None
                }

            parsed_result = json.loads(db_job.result_payload) if db_job.result_payload else None

            return {
                "status": db_job.status,
                "result": parsed_result,
                "error": db_job.error_message,
                "created_at": db_job.created_at.isoformat()
            }


job_manager = JobManager()
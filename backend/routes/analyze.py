from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException, Depends
import shutil
import uuid

from services.SummaryService import SummaryService
from services.TranscriptionService import TranscriptionService
from services.JobManager import job_manager, JobStatus
from services.AudioPipelineService import process_audio_pipeline
from core.dependencies import get_transcription_service, get_summary_service

router = APIRouter()


@router.post("/jobs/submit", status_code=202)
async def submit_audio_job(
        background_tasks: BackgroundTasks,
        file: UploadFile = File(...),
        transcription_service: TranscriptionService = Depends(get_transcription_service),
        summary_service: SummaryService = Depends(get_summary_service)
):
    unique_id = uuid.uuid4().hex
    original_path = f"temp_{unique_id}_{file.filename}"

    with open(original_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    job_id = await job_manager.create_job()

    background_tasks.add_task(
        process_audio_pipeline,
        job_id,
        original_path,
        transcription_service,
        summary_service
    )

    return {"job_id": job_id, "status": JobStatus.PENDING}


@router.get("/jobs/{job_id}")
async def get_job_status(job_id: str):
    job = await job_manager.get_job(job_id)
    if job["status"] == JobStatus.NOT_FOUND:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
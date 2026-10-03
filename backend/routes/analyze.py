from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.concurrency import run_in_threadpool
import shutil
import os
import uuid
import filetype
import hashlib

from backend.services.SummaryService import SummaryService
from backend.services.TranscriptionService import TranscriptionService
from backend.core.audio_utils import convert_audio_to_wav
from backend.core.dependencies import get_transcription_service, get_summary_service

router = APIRouter()

TRANSCRIPTION_CACHE = {}
SUMMARY_CACHE = {}


def calculate_file_hash(file_path: str) -> str:
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()


@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    transcription_service: TranscriptionService = Depends(get_transcription_service)
):
    unique_id = uuid.uuid4().hex
    original_path = f"temp_{unique_id}_{file.filename}"
    file_to_analyze = original_path

    try:
        with open(original_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        kind = filetype.guess(original_path)
        if kind is None:
            raise HTTPException(status_code=400, detail="Cannot determine file type")

        if kind.extension != "wav":
            file_to_analyze = convert_audio_to_wav(original_path)

        file_hash = await run_in_threadpool(calculate_file_hash, file_to_analyze)

        if file_hash in TRANSCRIPTION_CACHE:
            return {"transcription": TRANSCRIPTION_CACHE[file_hash]}

        transcript_data = await run_in_threadpool(
            transcription_service.get_transcriber_data, file_to_analyze
        )

        response_data = {
            "content": transcript_data.content,
            "language": transcript_data.language,
            "word_count": transcript_data.word_count,
            "words_per_minute": transcript_data.words_per_minute,
        }

        TRANSCRIPTION_CACHE[file_hash] = response_data
        return {"transcription": response_data}

    finally:
        if os.path.exists(original_path):
            os.remove(original_path)
        if file_to_analyze != original_path and os.path.exists(file_to_analyze):
            os.remove(file_to_analyze)


@router.post("/summarize")
async def summarize(
    file: UploadFile = File(...),
    transcription_service: TranscriptionService = Depends(get_transcription_service),
    summary_service: SummaryService = Depends(get_summary_service)
):
    unique_id = uuid.uuid4().hex
    original_path = f"temp_{unique_id}_{file.filename}"
    file_to_analyze = original_path

    try:
        with open(original_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        kind = filetype.guess(original_path)
        if kind is None:
            raise HTTPException(status_code=400, detail="Cannot determine file type")

        if kind.extension != "wav":
            file_to_analyze = convert_audio_to_wav(original_path)

        file_hash = await run_in_threadpool(calculate_file_hash, file_to_analyze)

        if file_hash in SUMMARY_CACHE:
            return {"summary": SUMMARY_CACHE[file_hash]}

        if file_hash in TRANSCRIPTION_CACHE:
            transcript_content = TRANSCRIPTION_CACHE[file_hash]["content"]
        else:
            transcript_data = await run_in_threadpool(
                transcription_service.get_transcriber_data, file_to_analyze
            )
            transcript_content = transcript_data.content
            TRANSCRIPTION_CACHE[file_hash] = {
                "content": transcript_data.content,
                "language": transcript_data.language,
                "word_count": transcript_data.word_count,
                "words_per_minute": transcript_data.words_per_minute,
            }

        summary_data = await run_in_threadpool(
            summary_service.analyze_transcript, transcript_content
        )

        response_data = {
            "breakdown": summary_data.breakdown,
            "topics": summary_data.topics,
        }

        SUMMARY_CACHE[file_hash] = response_data
        return {"summary": response_data}

    finally:
        if os.path.exists(original_path):
            os.remove(original_path)
        if file_to_analyze != original_path and os.path.exists(file_to_analyze):
            os.remove(file_to_analyze)
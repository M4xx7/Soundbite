from functools import lru_cache

from backend.services.SummaryService import SummaryService
from backend.services.TranscriptionService import TranscriptionService

@lru_cache()
def get_transcription_service() -> TranscriptionService:
    return TranscriptionService(model_size="small")

@lru_cache()
def get_summary_service() -> SummaryService:
    return SummaryService()
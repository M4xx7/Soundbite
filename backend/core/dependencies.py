from functools import lru_cache

from services.SummaryService import SummaryService
from services.TranscriptionService import TranscriptionService


@lru_cache()
def get_transcription_service() -> TranscriptionService:
    return TranscriptionService()

@lru_cache()
def get_summary_service() -> SummaryService:
    return SummaryService()
from functools import lru_cache
from backend.services.TranscriptionService import TranscriptionService
from backend.services.UnderstandingService import UnderstandingService

@lru_cache()
def get_transcription_service() -> TranscriptionService:
    return TranscriptionService(model_size="small")

@lru_cache()
def get_understanding_service() -> UnderstandingService:
    return UnderstandingService()
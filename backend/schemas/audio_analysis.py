from pydantic import BaseModel
from typing import List, Dict, Any


class TranscriberData(BaseModel):
    content: str
    language: str
    word_count: int
    words_per_minute: float


class UnderstandingResult(BaseModel):
    summary: str
    topics: List[str]




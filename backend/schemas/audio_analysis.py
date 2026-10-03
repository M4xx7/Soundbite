from pydantic import BaseModel
from typing import List


class TranscriberData(BaseModel):
    content: str
    language: str
    word_count: int
    words_per_minute: float


class SummaryResult(BaseModel):
    breakdown: str
    topics: List[str]




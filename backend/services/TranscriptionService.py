import httpx
import os

from schemas.audio_analysis import TranscriberData


class TranscriptionService:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY environment variable is missing or not set!")
        self.url = "https://api.groq.com/openai/v1/audio/transcriptions"

    async def get_transcriber_data(self, audio_path: str) -> TranscriberData:
        headers = {"Authorization": f"Bearer {self.api_key}"}

        async with httpx.AsyncClient(timeout=30.0) as client:
            with open(audio_path, "rb") as f:
                files = {"file": (os.path.basename(audio_path), f, "audio/wav")}
                data = {
                    "model": "whisper-large-v3-turbo",
                    "response_format": "verbose_json"
                }

                response = await client.post(self.url, headers=headers, files=files, data=data)
                response.raise_for_status()
                result = response.json()

                content = result.get("text", "").strip()
                word_count = len(content.split())

                duration = float(result.get("duration", 0.0))
                language = result.get("language", "en")

                wpm = (word_count / duration * 60) if duration > 0 else 0.0

                return TranscriberData(
                    content=content,
                    language=language,
                    word_count=word_count,
                    words_per_minute=round(wpm, 2)
                )
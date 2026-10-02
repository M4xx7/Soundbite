import requests
import json
from backend.schemas.audio_analysis import UnderstandingResult


class UnderstandingService:
    def __init__(self, model_name: str = "llama3.2", base_url: str = "http://localhost:11434"):
        self.model_name = model_name
        self.base_url = base_url

    def analyze_transcript(self, transcript_text: str) -> UnderstandingResult:
        prompt = f"""
You are an expert voice and speech analysis assistant. Analyze the following transcript and return a valid JSON object ONLY, with no extra markdown or text.

Transcript:
\"\"\"{transcript_text}\"\"\"

Required JSON structure:
{{
  "summary": "A concise 2-3 sentence summary of what the audio is about.",
  "topics": ["topic1", "topic2", "topic3, ..."]
}}
"""
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model_name,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json"
                },
                timeout=60
            )
            response.raise_for_status()
            result = response.json()
            parsed_data = json.loads(result.get("response", "{}"))

            return UnderstandingResult(
                summary=parsed_data.get("summary", "No summary generated."),
                topics=parsed_data.get("topics", []),
            )
        except Exception as e:
            print(f"OLLAMA ERROR: {e}")
            return UnderstandingResult(
                summary="Could not generate summary via local LLM.",
                topics=[],
            )

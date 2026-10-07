import httpx
import os
import json
from schemas.audio_analysis import SummaryResult

class SummaryService:
    def __init__(self, api_key: str = None, model_name: str = "openai/gpt-oss-20b"):
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY environment variable is missing or not set!")
        self.model_name = model_name
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    async def analyze_transcript(self, transcript_text: str) -> SummaryResult:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        prompt = f"""
You are an expert voice and speech analysis assistant. Analyze the following transcript and return a valid JSON object ONLY, with no extra markdown or text or backticks.

Transcript:
\"\"\"{transcript_text}\"\"\"

Required JSON structure:
{{
  "summary": "A concise 2-3 sentence summary of what the audio is about.",
  "topics": ["topic1", "topic2", "topic3"]
}}
"""
        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.3
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(self.url, headers=headers, json=payload)

                if response.status_code != 200:
                    print(f"GROQ API ERROR DETAILS: {response.status_code} - {response.text}")

                response.raise_for_status()
                result = response.json()

                content_str = result["choices"][0]["message"]["content"]
                cleaned_content = content_str.strip()
                if cleaned_content.startswith("```json"):
                    cleaned_content = cleaned_content[7:]
                if cleaned_content.endswith("```"):
                    cleaned_content = cleaned_content[:-3]

                parsed_data = json.loads(cleaned_content.strip())

                return SummaryResult(
                    breakdown=parsed_data.get("summary", "No summary generated."),
                    topics=parsed_data.get("topics", []),
                )
            except Exception as e:
                print(f"GROQ SUMMARY EXCEPTION: {e}")
                return SummaryResult(
                    breakdown="Could not generate summary via Groq API.",
                    topics=[],
                )
from faster_whisper import WhisperModel
from typing import List
from backend.schemas.audio_analysis import TranscriberData


class TranscriptionService:
    def __init__(self, model_size: str = "small", device: str = "cpu", compute_type: str = "int8"):
        self.model = WhisperModel(model_size, device=device, compute_type=compute_type)

    def get_transcriber_data(self, audio_path: str) -> TranscriberData:
        segments, info = self.model.transcribe(
            audio_path,
            beam_size=5,
            vad_filter=True,
            vad_parameters=dict(min_silence_duration_ms=500),
            word_timestamps=True
        )

        segments_list = list(segments)
        full_text_parts: List[str] = []

        for seg in segments_list:
            full_text_parts.append(seg.text.strip())


        content = " ".join(full_text_parts).strip()
        duration = float(info.duration)
        word_count = len(content.split())

        wpm = (word_count / duration * 60) if duration > 0 else 0.0

        return TranscriberData(
            content=content,
            language=info.language,
            word_count=word_count,
            words_per_minute=round(wpm, 2),
        )
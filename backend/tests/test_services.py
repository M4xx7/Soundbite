import pytest
from unittest.mock import patch, AsyncMock, MagicMock
import unittest
import httpx
from services.SummaryService import SummaryService
from services.TranscriptionService import TranscriptionService
from schemas.audio_analysis import SummaryResult, TranscriberData


@pytest.mark.asyncio
@patch("services.SummaryService.httpx.AsyncClient")
async def test_summary_service_success(mock_client_cls):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "choices": [
            {
                "message": {
                    "content": '{"summary": "Test summary text.", "topics": ["python", "testing"]}'
                }
            }
        ]
    }
    mock_response.raise_for_status = MagicMock()

    mock_client = AsyncMock()
    mock_client.post.return_value = mock_response
    mock_client_cls.return_value.__aenter__.return_value = mock_client

    service = SummaryService(api_key="fake_key")
    result = await service.analyze_transcript("This is a test transcript.")

    assert isinstance(result, SummaryResult)
    assert result.breakdown == "Test summary text."
    assert result.topics == ["python", "testing"]


@pytest.mark.asyncio
@patch("services.SummaryService.httpx.AsyncClient")
async def test_summary_service_failure_fallback(mock_client_cls):
    mock_response = MagicMock()
    mock_response.status_code = 500
    mock_response.text = "Internal Server Error"
    mock_response.raise_for_status.side_effect = httpx.HTTPStatusError("Error", request=MagicMock(), response=mock_response)

    mock_client = AsyncMock()
    mock_client.post.return_value = mock_response
    mock_client_cls.return_value.__aenter__.return_value = mock_client

    service = SummaryService(api_key="fake_key")
    result = await service.analyze_transcript("Fail test transcript.")

    assert result.breakdown == "Could not generate summary via Groq API."
    assert result.topics == []


@pytest.mark.asyncio
@patch("services.TranscriptionService.httpx.AsyncClient")
@patch("builtins.open", new_callable=unittest.mock.mock_open, read_data=b"fake_audio_bytes")
@patch("os.path.exists", return_value=True)
async def test_transcription_service_success(mock_exists, mock_file, mock_client_cls):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "text": "Hello world from audio transcription",
        "duration": 10.0,
        "language": "en"
    }
    mock_response.raise_for_status = MagicMock()

    mock_client = AsyncMock()
    mock_client.post.return_value = mock_response
    mock_client_cls.return_value.__aenter__.return_value = mock_client

    service = TranscriptionService(api_key="fake_key")
    result = await service.get_transcriber_data("dummy_path.wav")

    assert isinstance(result, TranscriberData)
    assert result.content == "Hello world from audio transcription"
    assert result.word_count == 5
    assert result.language == "en"
    assert result.words_per_minute == 30.0
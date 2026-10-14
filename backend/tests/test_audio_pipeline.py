import os
from unittest.mock import AsyncMock, patch
import pytest
from services.AudioPipelineService import process_audio_pipeline
from services.JobManager import JobStatus


@pytest.mark.asyncio
@patch("services.AudioPipelineService.os.path.exists", return_value=True)
@patch("services.AudioPipelineService.os.remove")
@patch("services.AudioPipelineService.job_manager")
async def test_process_audio_pipeline_success(mock_job_manager, mock_remove, mock_exists):
    mock_job_manager.update_job = AsyncMock()

    mock_transcription_service = AsyncMock()
    mock_summary_service = AsyncMock()

    mock_trans_data = AsyncMock()
    mock_trans_data.content = "Hello world"
    mock_trans_data.language = "en"
    mock_trans_data.word_count = 2
    mock_trans_data.words_per_minute = 120
    mock_transcription_service.get_transcriber_data = AsyncMock(return_value=mock_trans_data)

    mock_sum_data = AsyncMock()
    mock_sum_data.breakdown = "A short summary"
    mock_sum_data.topics = ["testing"]
    mock_summary_service.analyze_transcript = AsyncMock(return_value=mock_sum_data)

    file_path = "temp_123_test.mp3"
    await process_audio_pipeline(
        job_id="job_abc",
        file_path=file_path,
        transcription_service=mock_transcription_service,
        summary_service=mock_summary_service
    )

    mock_job_manager.update_job.assert_any_call("job_abc", JobStatus.PROCESSING)
    mock_remove.assert_called_once_with(file_path)


@pytest.mark.asyncio
@patch("services.AudioPipelineService.os.path.exists", return_value=True)
@patch("services.AudioPipelineService.os.remove")
@patch("services.AudioPipelineService.job_manager")
async def test_process_audio_pipeline_failure(mock_job_manager, mock_remove, mock_exists):
    mock_job_manager.update_job = AsyncMock()

    mock_transcription_service = AsyncMock()
    mock_transcription_service.get_transcriber_data = AsyncMock(side_effect=Exception("Transcription failed"))
    mock_summary_service = AsyncMock()

    file_path = "temp_123_test.mp3"
    await process_audio_pipeline(
        job_id="job_abc",
        file_path=file_path,
        transcription_service=mock_transcription_service,
        summary_service=mock_summary_service
    )

    mock_job_manager.update_job.assert_called_with("job_abc", JobStatus.FAILED, error="Transcription failed")
    mock_remove.assert_called_once_with(file_path)
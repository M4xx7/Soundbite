import os
from backend.services.JobManager import job_manager, JobStatus


async def process_audio_pipeline(job_id: str, file_path: str, transcription_service, summary_service):

    try:
        await job_manager.update_job(job_id, JobStatus.PROCESSING)

        transcript_data = await transcription_service.get_transcriber_data(file_path)

        summary_data = await summary_service.analyze_transcript(transcript_data.content)

        result_payload = {
            "transcription": {
                "content": transcript_data.content,
                "language": transcript_data.language,
                "word_count": transcript_data.word_count,
                "words_per_minute": transcript_data.words_per_minute,
            },
            "summary": {
                "breakdown": summary_data.breakdown,
                "topics": summary_data.topics,
            }
        }

        await job_manager.update_job(job_id, JobStatus.COMPLETED, result=result_payload)

    except Exception as e:
        await job_manager.update_job(job_id, JobStatus.FAILED, error=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
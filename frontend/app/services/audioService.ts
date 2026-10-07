import { SUBMIT_JOB_URL, getJobStatusUrl, JobStatusResponse } from '../config/api';


export async function uploadAndProcessAudio(
  audioUri: string,
  onStatusChange?: (status: string) => void
): Promise<JobStatusResponse> {
  const filename = audioUri.split('/').pop() || 'recording.wav';
  
  const formData = new FormData();
  formData.append('file', {
    uri: audioUri,
    name: filename,
    type: 'audio/wav',
  } as any);

  onStatusChange?.('Uploading audio...');

  const submitResponse = await fetch(SUBMIT_JOB_URL, {
    method: 'POST',
    body: formData,
  });

  if (!submitResponse.ok) {
    throw new Error(`Failed to submit job: ${submitResponse.statusText}`);
  }

  const { job_id } = await submitResponse.json();

  if (!job_id) {
    throw new Error('Server did not return a job ID.');
  }

  const maxAttempts = 60;
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 2000)); 
    attempts++;

    const statusResponse = await fetch(getJobStatusUrl(job_id));
    if (!statusResponse.ok) continue;

    const jobData: JobStatusResponse = await statusResponse.json();
    onStatusChange?.(`Processing job status: ${jobData.status}`);

    if (jobData.status === 'completed') {
      return jobData;
    }

    if (jobData.status === 'failed') {
      throw new Error(jobData.error || 'Audio processing pipeline failed.');
    }
  }

  throw new Error('Job processing timed out.');
}
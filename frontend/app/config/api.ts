
export const SUBMIT_JOB_URL = "https://soundbite-production.up.railway.app/jobs/submit";

export const getJobStatusUrl = (jobId: string) => `${API_BASE_URL}/jobs/${jobId}`;

export interface JobResultPayload {
  transcription: {
    content: string;
    language: string;
    word_count: number;
    words_per_minute: number;
  };
  summary: {
    breakdown: string;
    topics: string[];
  };
}

export interface JobStatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'not_found';
  result: JobResultPayload | null;
  error: string | null;
  created_at?: string;
}
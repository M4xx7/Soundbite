
# Voice Analyzer

<img src="docs/screenshots/home.jpg" width="250"/>


## Try It Out

### Mobile App (Android)
Download and install the APK:

https://expo.dev/accounts/h4cker/projects/voice-analyzer-app/builds/fbc78b40-8979-4c63-a9ea-f24d3bcdff42

### Backend API
The backend is deployed on Hugging Face Spaces and can be tested via the  FastAPI documentation:

https://makss7-voice-analyzer-api.hf.space/docs



**Voice Analyzer** is a tool made for analyzing and evaluating human speech recordings. It includes a mobile application built with Expo Go (React Native + TypeScript) and a Python backend API that processes audio, extracts features, and returns analysis results.

## Project Architecture

The project consists of two main components:

### Mobile Application
The mobile app provides the user interface and is developed using TypeScript and React Native with Expo Go. It allows users to record or upload audio and view analysis results.

The app has two pages:
* **Analyze audio** – allows to extract linguistic and speech characteristics
* **Evaluate audio** – assesses overall audio quality

<p align="center">
  <img src="docs/screenshots/analyze.jpg" width="250"/>
  <img src="docs/screenshots/evaluate.jpg" width="250"/>
</p>


On both pages, users can:
* record audio directly from the device microphone
* upload existing audio files
* play back audio after processing
* view results returned by the backend

The app communicates with the backend through REST API requests.

### Python Backend
The backend is implemented in Python and includes two endpoints.

* `/analyze` – performs transcription and speech analysis
* `/evaluate` – computes acoustic quality metrics and overall score of the audio

---

## Core Processing Modules

### VoiceTranscriber
Used for extraction of speech and language information when `/analyze` endpoint receives a request. This module uses **OpenAI Whisper** for speech recognition.

It provides:
* Speech transcription
* Language detection
* Word count
* Words per minute (WPM)
* Sound purity classification

### VoiceAnalyzer
Used to compute acoustic quality metrics from the audio signal with **Praat/Parselmouth** when `/evaluate` endpoint receives a request.

It extracts:
* **Jitter** – pitch period variability
* **Shimmer** – amplitude variability
* **HNR** – harmonics-to-noise ratio
* **SNR** – signal-to-noise ratio

An overall audio quality score is calculated based on those metrics.

## Technologies Used

**Frontend**
* React Native
* Expo Go
* TypeScript

**Backend**
* Python
* FastAPI / Flask 
* OpenAI Whisper


## Workflow

1. The user records or uploads an audio file in the mobile app.
2. The file is sent to the Python backend via HTTP request.
3. The backend:
   * converts audio to WAV
   * transcribes speech using Whisper
   * extracts acoustic features using Parselmouth
4. The backend returns structured JSON data.
5. The mobile app displays the results:
   * **Analyze page** shows transcription and speech metrics
   * **Evaluate page** shows acoustic metrics and quality score

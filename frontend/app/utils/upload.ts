import * as DocumentPicker from 'expo-document-picker';
import { createSound } from './createSound';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import axios from 'axios';

async function pollJobStatus(baseUrl: string, jobId: string): Promise<any> {
    const baseClean = baseUrl.replace(/\/jobs\/submit\/?$/, '');
    const statusUrl = `${baseClean}/jobs/${jobId}`;

    const maxAttempts = 60;
    let attempts = 0;

    while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        attempts++;

        try {
            const response = await axios.get(statusUrl);
            const data = response.data;

            if (data.status === 'completed') {
                return data.result;
            }
            if (data.status === 'failed') {
                throw new Error(data.error || 'Pipeline processing failed.');
            }
        } catch (err: any) {
            console.error(`Polling error on attempt ${attempts}:`, err.message);
        }
    }

    throw new Error('Job processing timed out.');
}


export async function pickAndUpload(
    apiUrl: string,
    setCurrentAudioName: (value: string) => void,
    setLoading: (value: boolean) => void,
    setResult: (value: any) => void,
    setIsPlaying: (value: boolean) => void,
    setSound: (value: Audio.Sound) => void
) {
    try {
        const file = await DocumentPicker.getDocumentAsync({
            type: 'audio/*',
            copyToCacheDirectory: true
        });

        if (file.canceled) {
            return;
        }

        const selectedFile = file.assets[0];
        setCurrentAudioName(selectedFile.name);
        setLoading(true);

        const formData = new FormData();
        formData.append('file', {
            uri: selectedFile.uri,
            name: selectedFile.name,
            type: selectedFile.mimeType || 'audio/wav',
        } as any);

        console.log("Submitting job via fetch to:", apiUrl);

        const submitResponse = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });

        if (!submitResponse.ok) {
            throw new Error(`Server returned status ${submitResponse.status}`);
        }

        const responseData = await submitResponse.json();
        const jobId = responseData.job_id;

        if (!jobId) {
            throw new Error('No job ID returned from server.');
        }

        const finalResult = await pollJobStatus(apiUrl, jobId);

        setResult(finalResult);
        await createSound(selectedFile.uri, setIsPlaying, setSound);

    } catch (error: any) {
        console.error("Pick and upload error:", error.message || error);
    } finally {
        setLoading(false);
    }
}


export async function uploadRecordedAudio(
    apiUrl: string,
    recordedUri: string | null,
    setRecordedUri: (value: any) => void,
    setLoading: (value: boolean) => void,
    setResult: (value: any) => void,
    setIsPlaying: (value: boolean) => void,
    setSound: (value: Audio.Sound) => void
) {
    if (!recordedUri) return;

    const isIOS = Platform.OS === 'ios';
    const fileName = isIOS ? "voice.wav" : "voice.m4a";
    const mimeType = isIOS ? "audio/wav" : "audio/m4a";

    const formData = new FormData();
    formData.append("file", {
        uri: recordedUri,
        name: fileName,
        type: mimeType,
    });

    try {
        setLoading(true);
        setRecordedUri(recordedUri);

        console.log("Submitting recorded job via fetch to:", apiUrl);

        const submitResponse = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });

        if (!submitResponse.ok) {
            const errorBody = await submitResponse.text(); 
            throw new Error(`Server returned status ${submitResponse.status}`);
        }

        const responseData = await submitResponse.json();
        const jobId = responseData.job_id;

        if (!jobId) {
            throw new Error('No job ID returned from server.');
        }

        const finalResult = await pollJobStatus(apiUrl, jobId);

        setResult(finalResult);
        await createSound(recordedUri, setIsPlaying, setSound);

    } catch (err: any) {
        console.error("Upload error:", err.message || err);
    } finally {
        setLoading(false);
        setRecordedUri(null);
    }
}
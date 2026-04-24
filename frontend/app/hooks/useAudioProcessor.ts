import { useState } from 'react';
import { togglePlayback } from '../utils/togglePlayback';
import { startRecording, stopRecording } from '../utils/recording';
import { pickAndUpload, uploadRecordedAudio } from '../utils/upload';

export const useAudioProcessor = (apiUrl) => {
    const [loading, setLoading] = useState(false);
    const [recording, setRecording] = useState(null);
    const [recordedUri, setRecordedUri] = useState(null);
    const [currentAudioName, setCurrentAudioName] = useState("");
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [result, setResult] = useState(null);

    const onTogglePlayback = async () =>
        await togglePlayback(isPlaying, sound, setIsPlaying);

    const onStartRecording = async () =>
        await startRecording(setRecording);

    const onStopRecording = async () =>
        await stopRecording(recording, setRecording, setRecordedUri, setCurrentAudioName);

    const onUploadRecordedAudio = async () =>
        await uploadRecordedAudio(apiUrl, recordedUri, setRecordedUri, setLoading, setResult, setIsPlaying, setSound);

    const onPickAndUpload = async () =>
        await pickAndUpload(apiUrl, setCurrentAudioName, setLoading, setResult, setIsPlaying, setSound);

    return {
        loading,
        recording,
        recordedUri,
        currentAudioName,
        sound,
        isPlaying,
        result,
        onTogglePlayback,
        onStartRecording,
        onStopRecording,
        onUploadRecordedAudio,
        onPickAndUpload
    };
};
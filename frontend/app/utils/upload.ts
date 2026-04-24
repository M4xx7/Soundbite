import * as DocumentPicker from 'expo-document-picker';
import { createSound } from './createSound';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import axios from 'axios';


export async function pickAndUpload(apiUrl: string, setCurrentAudioName: (value: string) => void, setLoading: (value: boolean) => void, setResult: (value) => void, setIsPlaying: (value: boolean) => void, setSound: (value: Audio.Sound) => void) {

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
        });

        const response = await axios.post(apiUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        setResult(response.data);
        await createSound(selectedFile.uri, setIsPlaying, setSound);

    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
}

export async function uploadRecordedAudio(apiUrl: string, recordedUri, setRecordedUri: (value) => void, setLoading: (value: boolean) => void, setResult: (value) => void, setIsPlaying: (value: boolean) => void, setSound: (value: Audio.Sound) => void) {
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
        const response = await axios.post(apiUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setResult(response.data);
        await createSound(recordedUri, setIsPlaying, setSound);
    } catch (err) {
        console.error("Upload error:", err);
    } finally {
        setLoading(false);
        setRecordedUri(null);
    }
};
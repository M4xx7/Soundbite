import { recordingOptions } from "@/app/utils/recordingOptions";
import { Audio } from "expo-av";

export async function startRecording(setRecording: (value) => void) {
    try {
        const permission = await Audio.requestPermissionsAsync();

        if (permission.status !== "granted") {
            alert("Permission to access microphone is required!");
            return;
        }

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
            recordingOptions
        );

        setRecording(recording);

    } catch (err) {
        console.error("Failed to start recording", err);
    }
}


export async function stopRecording(recording: Audio.Recording, setRecording: (value) => void, setRecordedUri: (value) => void, setCurrentAudioName: (value: string) => void) {
    await recording.stopAndUnloadAsync();
    setRecordedUri(recording.getURI());
    setCurrentAudioName("recording.wav");
    setRecording(null);
}


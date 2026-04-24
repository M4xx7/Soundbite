import { Audio } from "expo-av";

export async function togglePlayback( isPlaying: boolean, sound: Audio.Sound,setIsPlaying: (value: boolean) => void) {

    if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
    } else {
        await sound.playAsync();
        setIsPlaying(true);
    }
}
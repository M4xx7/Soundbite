import { Audio } from "expo-av";


export async function createSound(uri, setIsPlaying: (value: boolean) => void, setSound: (value: Audio.Sound) => void) {
    try {
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: uri },
            { shouldPlay: false }
        );

        newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                newSound.stopAsync();
                newSound.setPositionAsync(0);
                setIsPlaying(false);
            }
        });
        setSound(newSound);

    } catch (error) {
        console.log("play audio error: ", error);
    }
}

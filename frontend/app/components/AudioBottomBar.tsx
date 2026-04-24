import { View } from "react-native";
import PlaybackControlBtn from "./PlaybackControlBtn";
import { styles } from "@/app/styles/common";
import Icon from "./Icon";
import PrimaryBtn from "./PrimaryBtn";

export default function AudioBottomBar({
    loading, recording, recordedUri,
    onStartRecording, onStopRecording, onUploadRecordedAudio, onPickAndUpload,
    actionTitle
}) {
    return (
        <View style={[styles.bottomBar, { opacity: !loading ? 1 : 0 }]} pointerEvents={loading ? 'none' : 'auto'}>
            <View style={{ marginBottom: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    {recording ? (
                        <PlaybackControlBtn onPress={onStopRecording}>
                            <Icon name='stopRecording' width={40} height={40} />
                        </PlaybackControlBtn>
                    ) : (
                        <PlaybackControlBtn onPress={onStartRecording}>
                            <Icon name='microphone' width={40} height={40} />
                        </PlaybackControlBtn>
                    )}
                </View>

                <View style={{ opacity: recordedUri && !loading ? 1 : 0, marginBottom: 0, marginTop: 10 }}>
                    <PrimaryBtn title={actionTitle} onPress={onUploadRecordedAudio} />
                </View>
            </View>

            <PrimaryBtn title='Upload audio' onPress={onPickAndUpload} />
        </View>
    );
}
import React from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { typography } from './styles/typography';
import Icon from './components/Icon';
import { colors } from './styles/colors';
import { styles } from './styles/common';
import PlaybackControlBtn from '@/app/components/PlaybackControlBtn';
import AudioBottomBar from '@/app/components/AudioBottomBar';
import { useAudioProcessor } from '@/app/hooks/useAudioProcessor';
import { SUMMARIZE_URL } from './config/config';

export default function Summarize() {
    const {
        loading,
        recording,
        recordedUri,
        currentAudioName,
        result,
        onTogglePlayback,
        onStartRecording,
        onStopRecording,
        onUploadRecordedAudio,
        onPickAndUpload
    } = useAudioProcessor(SUMMARIZE_URL);

   
    const summary = result?.summary;

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Text style={[typography.title, { marginTop: 70 }]}>Summarize</Text>

            <View style={styles.loadingContainer}>
                {loading && <ActivityIndicator size="large" color={colors.textHighlight} />}
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20 }}>
                {summary && !loading ? (
                    <View style={{ marginTop: 30 }}>
                        <Text style={[typography.audio, { alignSelf: 'center', marginBottom: 20 }]}>
                            Audio: {currentAudioName}
                        </Text>

                        <View style={{ marginBottom: 25 }}>
                            <Text style={[typography.title, { fontSize: 18, marginBottom: 8 }]}>Summary</Text>
                            <Text style={[typography.body, { lineHeight: 22 }]}>
                                {summary.breakdown}
                            </Text>
                        </View>

                        {summary.topics && summary.topics.length > 0 && (
                            <View style={{ marginBottom: 25 }}>
                                <Text style={[typography.title, { fontSize: 18, marginBottom: 8 }]}>Topics</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {summary.topics.map((topic, index) => (
                                        <View 
                                            key={index} 
                                            style={{ 
                                                backgroundColor: colors.surface || '#2a2a2a', 
                                                paddingHorizontal: 12, 
                                                paddingVertical: 6, 
                                                borderRadius: 16 
                                            }}
                                        >
                                            <Text style={{ color: colors.textHighlight || '#fff', fontSize: 14 }}>
                                                {topic}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <PlaybackControlBtn onPress={onTogglePlayback}>
                                <Icon name='playPause' width={45} height={45} />
                            </PlaybackControlBtn>
                        </View>
                    </View>
                ) : (
                    null
                )}
            </ScrollView>

            <AudioBottomBar
                actionTitle="Summarize"
                loading={loading}
                recording={recording}
                recordedUri={recordedUri}
                onStartRecording={onStartRecording}
                onStopRecording={onStopRecording}
                onUploadRecordedAudio={onUploadRecordedAudio}
                onPickAndUpload={onPickAndUpload}
            />
        </View>
    );
}
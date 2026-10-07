import React from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { typography } from './styles/typography';
import Icon from './components/Icon';
import { colors } from './styles/colors';
import { styles } from './styles/common';
import PlaybackControlBtn from '@/app/components/PlaybackControlBtn';
import AudioBottomBar from '@/app/components/AudioBottomBar';
import { useAudioProcessor } from '@/app/hooks/useAudioProcessor';
import { SUBMIT_JOB_URL } from './config/api';
import TestScreen from './components/TestScreen';

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
    } = useAudioProcessor(SUBMIT_JOB_URL);

    const summary = result?.summary;

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 }}>
            <Text style={[typography.title, { marginTop: 80, marginBottom: 20 }]}>Summarize</Text>

            <View style={styles.loadingContainer}>
                {loading && <ActivityIndicator size="large" color={colors.primary} />}
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {summary && !loading ? (
                    <View style={{ marginTop: 10 }}>
                        <Text style={[typography.audio, { fontSize: 16, marginBottom: 20 }]}>
                            Audio: {currentAudioName}
                        </Text>

                        {/* Distinct Dark Mode Card for Breakdown Text */}
                        <View style={{
                            backgroundColor: '#1C1C1E',
                            borderRadius: 16,
                            padding: 20,
                            marginBottom: 24,
                            borderWidth: 1.5,
                            borderColor: '#38383A',
                        }}>
                            <Text style={[typography.body, { lineHeight: 24, color: colors.text }]}>
                                {summary.breakdown}
                            </Text>
                        </View>

                        {/* Centered Topics Section */}
                        {summary.topics && summary.topics.length > 0 && (
                            <View style={{ marginBottom: 30 }}>
                                <Text style={[typography.subtitle, { fontSize: 18, marginBottom: 12, textAlign: 'center' }]}>
                                    Key Topics
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    gap: 8,
                                    justifyContent: 'center'
                                }}>
                                    {summary.topics.map((topic, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                backgroundColor: '#2C2C2E',
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                borderRadius: 16,
                                                borderWidth: 1,
                                                borderColor: '#48484A'
                                            }}
                                        >
                                            <Text style={{ color: colors.primary, fontSize: 15, fontWeight: '600' }}>
                                                {topic}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <PlaybackControlBtn onPress={onTogglePlayback}>
                                <Icon name='playPause' width={45} height={45} />
                            </PlaybackControlBtn>
                        </View>
                    </View>
                ) : null}
            </ScrollView>

            <TestScreen></TestScreen>

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
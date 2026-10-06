import React from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { typography } from './styles/typography';
import Icon from './components/Icon';
import { colors } from './styles/colors';
import { styles } from './styles/common';
import PlaybackControlBtn from '@/app/components/PlaybackControlBtn';
import AudioBottomBar from '@/app/components/AudioBottomBar';
import MetricDisplay from '@/app/components/MetricDisplay';
import { useAudioProcessor } from '@/app/hooks/useAudioProcessor';
import { SUBMIT_JOB_URL } from './config/api';

export default function Transcribe() {
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

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 }}>
            <Text style={[typography.title, { marginTop: 80, marginBottom: 20 }]}>Transcribe</Text>

            <View style={styles.loadingContainer}>
                {loading && <ActivityIndicator size="large" color={colors.primary} />}
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
                {result && !loading ? (
                    <View style={{ marginTop: 10 }}>
                        <Text style={[typography.audio, { fontSize: 16, marginBottom: 20, alignSelf: 'center' }]}>
                            Audio: {currentAudioName}
                        </Text>

                        <View style={{ 
                            backgroundColor: '#1C1C1E', 
                            borderRadius: 16, 
                            padding: 20, 
                            marginBottom: 24,
                            borderWidth: 1.5,
                            borderColor: '#38383A',
                        }}>
                            <Text style={[typography.body, { lineHeight: 24, color: colors.text }]}>
                                {result.transcription.content}
                            </Text>
                        </View>

                        {/* Metrics Grid */}
                        <View style={styles.container}>
                            <MetricDisplay
                                title={"language"}
                                value={result.transcription.language}
                                iconName="language"
                            />
                            <MetricDisplay
                                title={"words"}
                                value={result.transcription.word_count}
                                iconName="words"
                            />
                            <MetricDisplay
                                title={"wpm"}
                                value={result.transcription.words_per_minute}
                                iconName="speedometer"
                            />
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <PlaybackControlBtn onPress={onTogglePlayback}>
                                <Icon name='playPause' width={45} height={45} />
                            </PlaybackControlBtn>
                        </View>
                    </View>
                ) : null}
            </ScrollView>

            <AudioBottomBar
                actionTitle="Transcribe recording"
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
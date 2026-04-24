import React, { useState } from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { typography } from './styles/typography';
import Icon from './components/Icon';
import { colors } from './styles/colors';
import { styles } from './styles/common';
import PrimaryBtn from '@/app/components/PrimaryBtn';
import PlaybackControlBtn from '@/app/components/PlaybackControlBtn';
import { startRecording, stopRecording } from './utils/recording';
import { pickAndUpload, uploadRecordedAudio } from './utils/upload';
import { EVALUATE_URL } from './config/config';
import AudioBottomBar from '@/app/components/AudioBottomBar';
import MetricDisplay from './components/MetricDisplay';
import { useAudioProcessor } from '@/app/hooks/useAudioProcessor';

export default function Evaluate() {


    const {
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
    } = useAudioProcessor(EVALUATE_URL);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>

            <Text style={[typography.title, { marginTop: 70 }]}>Evaluate audio</Text>

            <View style={styles.loadingContainer}>
                {loading && <ActivityIndicator size="large" color={colors.textHighlight} />}
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {result && !loading ?
                    <View style={{ marginTop: 70 }}>
                        <Text style={[typography.audio, { alignSelf: 'center' }]}>Audio: {currentAudioName}</Text>

                        <View style={{ marginVertical: 10 }}>
                            <View style={styles.container}>
                                <MetricDisplay
                                    title="pitch variation"
                                    value={`${Number(result.jitter.toFixed(2))}%`}
                                />
                                <MetricDisplay
                                    title="volume variation"
                                    value={`${Number(result.shimmer.toFixed(2))}%`}
                                />
                            </View>
                            <View style={styles.container}>
                                <MetricDisplay
                                    title="voice cleanliness"
                                    value={`${Number(result.harmonicity.toFixed(2))} dB`}
                                />
                                <MetricDisplay
                                    title="background noise"
                                    value={`${Number(result.snr.toFixed(2))} dB`}
                                />
                            </View>
                        </View>

                        <Text style={[typography.audio, { alignSelf: 'center' }]}>Score</Text>

                        <View style={{ alignItems: 'center', marginVertical: 10 }}>
                            <Text style={typography.metric}>{Number(result.quality_score.toFixed(0))}/100</Text>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <PlaybackControlBtn onPress={onTogglePlayback}>
                                <Icon name='playPause' width={45} height={45}></Icon>
                            </PlaybackControlBtn>
                        </View>

                    </View>
                    : (
                        <Text>Upload or record an audio to evaluate</Text>
                    )
                }
            </ScrollView >

            <AudioBottomBar
                actionTitle="Evaluate recording"
                loading={loading}
                recording={recording}
                recordedUri={recordedUri}
                onStartRecording={onStartRecording}
                onStopRecording={onStopRecording}
                onUploadRecordedAudio={onUploadRecordedAudio}
                onPickAndUpload={onPickAndUpload}
            />

        </View >
    );
}
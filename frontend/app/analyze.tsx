import React, { useState } from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { typography } from './styles/typography';
import Icon from './components/Icon';
import { colors } from './styles/colors';
import { styles } from './styles/common';
import PrimaryBtn from '@/app/components/PrimaryBtn';
import PlaybackControlBtn from '@/app/components/PlaybackControlBtn';
import { togglePlayback } from './utils/togglePlayback';
import { startRecording, stopRecording } from './utils/recording';
import { ANALYZE_URL } from './config/config'
import { pickAndUpload, uploadRecordedAudio } from './utils/upload';
import AudioBottomBar from '@/app/components/AudioBottomBar';
import MetricDisplay from '@/app/components/MetricDisplay';
import { useAudioProcessor } from '@/app/hooks/useAudioProcessor';


export default function Analyze() {

    const API_URL = ANALYZE_URL

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
    } = useAudioProcessor(API_URL);


    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>

            <View style={styles.loadingContainer}>
                {loading && <ActivityIndicator size="large" color={colors.textHighlight} />}
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
                <Text style={[typography.title, { marginTop: 70 }]}>Analyze audio</Text>
                {result && !loading ?
                    <View style={{ marginTop: 70 }}>
                        <Text style={[typography.audio, {
                            alignSelf: 'center'
                        }]}>Audio: {currentAudioName}</Text>
                        <Text style={[typography.subtitle, { margin: 30 }]}>{result.transcription.content}</Text>
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
                        <View style={styles.container}>

                            <MetricDisplay
                                title="speech intensity"
                                value={result.metrics.speech_intensity}
                                iconName="speech"
                            />
                            <MetricDisplay
                                title="audio purity"
                                value={result.metrics.purity.label}
                                iconName="sound"
                            />

                        </View>

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <PlaybackControlBtn onPress={onTogglePlayback}>
                                <Icon name='playPause' width={45} height={45}></Icon>
                            </PlaybackControlBtn>
                        </View>

                    </View>
                    : (
                        <Text>Upload or record an audio to analyze</Text>
                    )
                }
            </ScrollView >

            <AudioBottomBar
                actionTitle="Analyze recording"
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
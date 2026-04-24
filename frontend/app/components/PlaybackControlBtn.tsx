import { colors } from '@/app/styles/colors';
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icon';

const PlaybackControlBtn = ({ onPress, children }) => {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            activeOpacity={0.7}>
            {children}
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        width: '20%',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: `30%`,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default PlaybackControlBtn
import { colors } from '@/app/styles/colors';
import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

const PrimaryBtn = ({ title, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            activeOpacity={0.7}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.surfaceSecondary,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: colors.primary,
        fontSize: 24,
        fontWeight: 600
    }
});

export default PrimaryBtn
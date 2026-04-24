import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from './Icon'
import { colors } from '@/app/styles/colors'

const PageBtn = ({ onPress, iconName, iconHeight, iconWidth }) => {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Icon
                name={iconName}
                height={iconHeight}
                width={iconWidth}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.surfaceSecondary,
        width: 140,
        height: 140,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PageBtn
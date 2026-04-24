// components/MetricDisplay.js
import React from 'react';
import { View, Text } from "react-native";
import Icon from "./Icon";
import { typography } from '@/app/styles/typography';
import { styles } from '@/app/styles/common';


export default function MetricDisplay({ title, value, iconName }) {
    return (
        <View style={{ alignItems: 'center' }}>
            {iconName ? (
                <View style={styles.iconWrapper}>
                    <Icon name={iconName} width={20} height={20} />
                    <Text style={typography.body}>{title}</Text>
                </View>
            ) : (
                <Text style={typography.subtitle}>{title}</Text>
            )}
            <Text style={typography.metric}>{typeof value === 'number' ? Math.round(value) : value}</Text>
        </View>
    );
}
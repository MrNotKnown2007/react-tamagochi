// components/StatBar.tsx
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface StatBarProps {
    label: string;
    value: number;
    maxValue?: number;
    color?: string;
}

export default function StatBar({
    label,
    value,
    maxValue = 100,
    color = '#4CAF50'
}: StatBarProps) {
    const percentage = Math.min(100, (value / maxValue) * 100);

    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <ThemedText style={styles.label}>{label}</ThemedText>
                <ThemedText style={styles.value}>{Math.round(value)}</ThemedText>
            </View>
            <ThemedView style={styles.barBackground}>
                <View
                    style={[
                        styles.barFill,
                        {
                            width: `${percentage}%`,
                            backgroundColor: color
                        }
                    ]}
                />
            </ThemedView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 2,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 1,
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    value: {
        fontSize: 10,
        opacity: 0.7,
    },
    barBackground: {
        height: 5,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 2.5,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 2.5,
    },
});
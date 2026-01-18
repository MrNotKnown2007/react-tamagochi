// components/StatSection.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface StatSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function StatSection({ title, children }: StatSectionProps) {
    return (
        <View style={styles.container}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        paddingLeft: 4,
    },
    content: {
        // backgroundColor: 'rgba(0,0,0,0.02)',
        // borderRadius: 12,
        // padding: 12,
        // borderWidth: 1,
        // borderColor: 'rgba(0,0,0,0.05)',
        backgroundColor: '#F7E3C8',
        borderRadius: 20,
        padding: 16,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
});
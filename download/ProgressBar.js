import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

const ProgressBar = ({ onComplete }) => {
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: 5000, // 5 seconds
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(() => {
            if (onComplete) {
                onComplete();
            }
        });
    }, [progress, onComplete]);

    const width = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, { width }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    progressBarContainer: {
        width: '100%',
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#3b5998',
        borderRadius: 5,
    },
});

export default ProgressBar;

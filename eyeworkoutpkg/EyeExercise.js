import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ToastAndroid } from 'react-native';

const EyeExercise = () => {
    const exercises = [
        { name: 'Exercise 1', gif: require('../gif/normal/gif1.gif') },
        { name: 'Exercise 2', gif: require('../gif/normal/gif2.gif') },
        { name: 'Exercise 3', gif: require('../gif/normal/gif3.gif') },
        { name: 'Exercise 4', gif: require('../gif/normal/gif4.gif') },
        { name: 'Exercise 5', gif: require('../gif/normal/gif5.gif') },
        // Add more exercises as needed
    ];

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer === 1) {
                if (currentExerciseIndex < exercises.length - 1) {
                    setCurrentExerciseIndex(currentExerciseIndex + 1);
                } else {
                    setCurrentExerciseIndex(0);
                }
                setTimer(30);
            } else {
                setTimer(timer - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timer, currentExerciseIndex, exercises.length]);

    const handlePreviousExercise = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(currentExerciseIndex - 1);
        } else {
            setCurrentExerciseIndex(exercises.length - 1);
        }
        setTimer(30);
    };

    const handleNextExercise = () => {
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
        } else {
            setCurrentExerciseIndex(0);
        }
        setTimer(30);
    };

    // Format the timer as "00:00"
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Eye Exercises</Text>
            <Image
                source={exercises[currentExerciseIndex].gif}
                style={styles.gif}
                resizeMode="contain"
            />
            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{formatTime(timer)}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                {currentExerciseIndex > 0 && (
                    <TouchableOpacity onPress={handlePreviousExercise} style={styles.button}>
                        <Text style={styles.buttonText}>Previous</Text>
                    </TouchableOpacity>
                )}
                {currentExerciseIndex < exercises.length - 1 && (
                    <TouchableOpacity onPress={handleNextExercise} style={styles.button}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#292929'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    gif: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    timerContainer: {
        marginBottom: 20,
    },
    timerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default EyeExercise;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ProgressBarAndroid } from 'react-native';
import { Audio } from 'expo-av';

const EyeExercise = () => {
    const exercises = [
        { name: 'Exercise 1', gif: require('../gif/normal/gif1.gif'), audio: require('../assets/raw/audio1.mp3') },
        { name: 'Exercise 2', gif: require('../gif/normal/gif2.gif'), audio: require('../assets/raw/audio2.mp3') },
        { name: 'Exercise 3', gif: require('../gif/normal/gif3.gif'), audio: require('../assets/raw/audio3.mp3') },
        { name: 'Exercise 4', gif: require('../gif/normal/gif4.gif'), audio: require('../assets/raw/audio4.mp3') },
        { name: 'Exercise 5', gif: require('../gif/normal/gif5.gif'), audio: require('../assets/raw/audio5.mp3') },
        { name: 'Exercise 6', gif: require('../gif/normal/gif6.gif'), audio: require('../assets/raw/audio6.mp3') },
        { name: 'Exercise 7', gif: require('../gif/normal/gif7.gif'), audio: require('../assets/raw/audio7.mp3') },
        { name: 'Exercise 8', gif: require('../gif/normal/gif8.gif'), audio: require('../assets/raw/audio8.mp3') },
        { name: 'Exercise 9', gif: require('../gif/normal/gif9.gif'), audio: require('../assets/raw/audio9.mp3') },
        { name: 'Exercise 10', gif: require('../gif/normal/gif10.gif'), audio: require('../assets/raw/audio10.mp3') },
        { name: 'Exercise 11', gif: require('../gif/normal/gif11.gif'), audio: require('../assets/raw/audio11.mp3') },
        { name: 'Exercise 12', gif: require('../gif/normal/gif12.gif'), audio: require('../assets/raw/audio12.mp3') },
        // Add more exercises as needed
    ];

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timer, setTimer] = useState(30);
    const [isPaused, setIsPaused] = useState(false);
    const [sound, setSound] = useState(null);

    useEffect(() => {
        let interval = null;
        if (!isPaused) {
            interval = setInterval(() => {
                if (timer === 1) {
                    handleNextExercise();
                    setTimer(30);
                } else {
                    setTimer(timer - 1);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timer, isPaused]);

    useEffect(() => {
        async function playSound() {
            if (sound) {
                await sound.unloadAsync();
            }
            const { sound: newSound } = await Audio.Sound.createAsync(exercises[currentExerciseIndex].audio);
            setSound(newSound);
            await newSound.playAsync();
        }

        playSound();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [currentExerciseIndex]);

    const handlePreviousExercise = async () => {
        if (currentExerciseIndex > 0) {
            if (sound) {
                await sound.unloadAsync();
            }
            setCurrentExerciseIndex(currentExerciseIndex - 1);
            setTimer(30);
        }
    };

    const handleNextExercise = async () => {
        if (currentExerciseIndex < exercises.length - 1) {
            if (sound) {
                await sound.unloadAsync();
            }
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setTimer(30);
        }
    };

    const handlePauseResume = async () => {
        setIsPaused(!isPaused);
        if (sound) {
            if (isPaused) {
                await sound.playAsync();
            } else {
                await sound.pauseAsync();
            }
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    return (
        <View style={styles.container}>
            <Image
                source={exercises[currentExerciseIndex].gif}
                style={styles.gif}
                resizeMode="contain"
            />

            <ProgressBarAndroid
                styleAttr="Horizontal"
                indeterminate={false}
                progress={(currentExerciseIndex + 1) / exercises.length}
                color="#007bff"
                style={styles.progressBar}
            />

            <Text style={styles.title}>{exercises[currentExerciseIndex].name}</Text>
            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{formatTime(timer)}</Text>
            </View>

            <TouchableOpacity onPress={handlePauseResume} style={styles.pauseButton}>
                <Text style={styles.pauseButtonText}>{isPaused ? 'Continue' : 'Pause'}</Text>
            </TouchableOpacity>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    onPress={handlePreviousExercise} 
                    style={[styles.navButton, currentExerciseIndex === 0 && styles.disabledButton]}
                    disabled={currentExerciseIndex === 0}
                >
                    <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={handleNextExercise} 
                    style={[styles.navButton, currentExerciseIndex === exercises.length - 1 && styles.disabledButton]}
                    disabled={currentExerciseIndex === exercises.length - 1}
                >
                    <Text style={styles.navButtonText}>Skip</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#292929'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 20,
    },
    gif: {
        width: 450,
        height: 380,
        marginBottom: -10,
    },
    timerContainer: {
        marginBottom: 20,
    },
    timerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    pauseButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginBottom: 20,
    },
    pauseButtonText: {
        color: 'white',
        fontSize: 18,
    },
    progressBar: {
        width: '100%',
        height: 20,
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    navButton: {
        backgroundColor: 'transparent',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    navButtonText: {
        color: 'white',
        fontSize: 16,
    },
    disabledButton: {
        opacity: 0.5,
    }
});

export default EyeExercise;

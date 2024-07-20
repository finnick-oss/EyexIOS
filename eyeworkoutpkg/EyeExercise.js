import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ProgressBarAndroid, BackHandler } from 'react-native';
import { Audio } from 'expo-av';
import { useRoute, useNavigation } from '@react-navigation/native';

const EyeExercise = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { showAllExercises } = route.params;

    const exercises = [
        { name: "BLINKING EXERCISE", gif: require('../gif/normal/gif1.gif'), audio: require('../assets/raw/audio1.mp3') },
        { name: "CLOCKWISE ROTATION", gif: require('../gif/normal/gif2.gif'), audio: require('../assets/raw/audio2.mp3') },
        { name: "ANTICLOCKWISE ROTATION", gif: require('../gif/normal/gif3.gif'), audio: require('../assets/raw/audio3.mp3') },
        { name: "LOOK RIGHT AND LEFT (SLOW)", gif: require('../gif/normal/gif4.gif'), audio: require('../assets/raw/audio4.mp3') },
        { name: "CLOSE YOUR EYES AND RELAX", gif: require('../gif/normal/gif5.gif'), audio: require('../assets/raw/audio5.mp3') },
        { name: "MOVE IN DIFFERENT DIRECTION", gif: require('../gif/normal/gif6.gif'), audio: require('../assets/raw/audio6.mp3') },
        { name: "MOVE IN DIFFERENT DIRECTION", gif: require('../gif/normal/gif7.gif'), audio: require('../assets/raw/audio7.mp3') },
        { name: "MOVE YOUR HEAD", gif: require('../gif/normal/gif8.gif'), audio: require('../assets/raw/audio8.mp3') },
        { name: "CLOSE AND OPEN YOUR EYES", gif: require('../gif/normal/gif9.gif'), audio: require('../assets/raw/audio9.mp3') },
        { name: "PUSH AGAINST YOUR TEMPLE", gif: require('../gif/normal/gif10.gif'), audio: require('../assets/raw/audio10.mp3') },
        { name: "DRAW A TRIANGLE", gif: require('../gif/normal/gif11.gif'), audio: require('../assets/raw/audio11.mp3') },
        { name: "DRAW A RECTANGLE", gif: require('../gif/normal/gif12.gif'), audio: require('../assets/raw/audio12.mp3') },
        // Add more exercises as needed
    ];

    const getRandomExercises = (allExercises, numberOfExercises) => {
        const shuffledExercises = allExercises.sort(() => 0.5 - Math.random());
        return shuffledExercises.slice(0, numberOfExercises);
    };

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timer, setTimer] = useState(30);
    const [isPaused, setIsPaused] = useState(false);
    const [sound, setSound] = useState(null);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const exercisesToShow = showAllExercises ? exercises : getRandomExercises(exercises, 4);
        setSelectedExercises(exercisesToShow);
    }, [showAllExercises]);

    useEffect(() => {
        const backAction = async () => {
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
            }
            navigation.goBack();
            return true;
        };
    
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    
        return () => {
            backHandler.remove();
        };
    }, [navigation, sound]);
    

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
        loadAndPlaySound();
        return () => unloadSound();
    }, [currentExerciseIndex, selectedExercises]);

    useEffect(() => {
        if (currentExerciseIndex === selectedExercises.length - 1 && timer === 1) {
            setIsCompleted(true);
        }
    }, [currentExerciseIndex, selectedExercises, timer]);

    const loadAndPlaySound = async () => {
        if (sound) {
            await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync(selectedExercises[currentExerciseIndex].audio);
        setSound(newSound);
        await newSound.playAsync();
    };

    const unloadSound = async () => {
        if (sound) {
            await sound.unloadAsync();
        }
    };

    const handleBackPress = async () => {
        
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
        }
        navigation.goBack();
    };

    const handlePreviousExercise = async () => {
        if (currentExerciseIndex > 0) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setCurrentExerciseIndex(currentExerciseIndex - 1);
            setTimer(30);
        }
    };

    const handleNextExercise = async () => {
        if (currentExerciseIndex < selectedExercises.length - 1) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setTimer(30);
        } else {
            setIsCompleted(true);
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

    useEffect(() => {
        if (isCompleted) {
            navigation.navigate('CompletedActivity');
        }
    }, [isCompleted]);

    return (
        <View style={styles.container}>
            {selectedExercises.length > 0 && (
                <>
                    <Image
                        source={selectedExercises[currentExerciseIndex].gif}
                        style={styles.gif}
                        resizeMode="contain"
                    />

                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={(currentExerciseIndex + 1) / selectedExercises.length}
                        color="#007bff"
                        style={styles.progressBar}
                    />

                    <Text style={styles.title}>{selectedExercises[currentExerciseIndex].name}</Text>
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
                            style={[styles.navButton, currentExerciseIndex === selectedExercises.length - 1 && styles.disabledButton]}
                            disabled={currentExerciseIndex === selectedExercises.length - 1}
                        >
                            <Text style={styles.navButtonText}>Skip</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', // Center content vertically and horizontally
        backgroundColor: '#292929'
    },
    title: {
        fontSize: 22,
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
        fontSize: 30,
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
        position: 'absolute',
        bottom: 20, // Adjust this value as needed to place the buttons at the desired distance from the bottom
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10, // Add horizontal padding for better spacing
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

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, BackHandler } from 'react-native';
import * as Progress from 'react-native-progress';
import { Audio } from 'expo-av';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

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
        // Activate keep awake when component mounts
        activateKeepAwake();

        // Cleanup function
        return () => {
            deactivateKeepAwake();
        };
    }, []);

    useEffect(() => {
        const exercisesToShow = showAllExercises ? exercises : getRandomExercises(exercises, 4);
        setSelectedExercises(exercisesToShow);
    }, [showAllExercises]);

    useEffect(() => {
        const backAction = async () => {
            deactivateKeepAwake();
            await stopAndUnloadSound();
            navigation.goBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [navigation, sound]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', async () => {
            deactivateKeepAwake();
            await stopAndUnloadSound();
        });

        return unsubscribe;
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
        return () => stopAndUnloadSound();
    }, [currentExerciseIndex, selectedExercises]);

    useEffect(() => {
        if (isCompleted) {
            navigation.navigate('CompletedActivity');
        }
    }, [isCompleted]);

    const loadAndPlaySound = async () => {
        if (sound) {
            await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync(selectedExercises[currentExerciseIndex].audio);
        setSound(newSound);
        await newSound.playAsync();
    };

    const stopAndUnloadSound = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
        }
    };

    const handleBackPress = async () => {
        deactivateKeepAwake();
        await stopAndUnloadSound();
        navigation.goBack();
    };

    const handlePreviousExercise = async () => {
        if (currentExerciseIndex > 0) {
            await stopAndUnloadSound();
            setCurrentExerciseIndex(currentExerciseIndex - 1);
            setTimer(30);
        }
    };

    const handleNextExercise = async () => {
        if (currentExerciseIndex < selectedExercises.length - 1) {
            await stopAndUnloadSound();
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

    return (
<View style={styles.container}>
    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="white" />
    </TouchableOpacity>

    {selectedExercises.length > 0 && (
        <>
            <Image
                source={selectedExercises[currentExerciseIndex].gif}
                style={styles.gif}
                resizeMode="contain"
            />
                    <Progress.Bar
                        progress={(currentExerciseIndex + 1) / selectedExercises.length}
                        width={null} // Full width
                        color="#007bff"
                        borderColor="#ddd"
                        height={10}
                        style={styles.progressBar}
                    />

            <Text style={styles.title}>{selectedExercises[currentExerciseIndex].name}</Text>
            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{formatTime(timer)}</Text>
            </View>

            <TouchableOpacity onPress={handlePauseResume} style={styles.pauseButton}>
                <Text style={styles.pauseButtonText}>{isPaused ? 'Continue' : 'Pause'}</Text>
            </TouchableOpacity>

            {/* Skip and Previous Buttons at the Bottom */}
            <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity
                    onPress={handlePreviousExercise}
                    disabled={currentExerciseIndex === 0}
                >
                    <Text
                        style={[
                            styles.textButton,
                            currentExerciseIndex === 0 && styles.disabledText,
                        ]}
                    >
                        Previous
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleNextExercise}
                    disabled={currentExerciseIndex === selectedExercises.length - 1}
                >
                    <Text
                        style={[
                            styles.textButton,
                            currentExerciseIndex === selectedExercises.length - 1 &&
                                styles.disabledText,
                        ]}
                    >
                        Skip
                    </Text>
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
        backgroundColor: '#292929',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
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
        marginTop:20,
        marginBottom: 20,
    },
    pauseButtonText: {
        color: 'white',
        fontSize: 18,
    },
    progressBar: {
        width: '100%',
        height: 10,
        marginBottom: 20,
        marginTop:20,
    },
    bottomButtonsContainer: {
        position: 'absolute',
        bottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    textButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    disabledText: {
        color: 'gray',
    },
});



export default EyeExercise;

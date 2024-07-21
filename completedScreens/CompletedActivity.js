import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, BackHandler, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const CompletedActivity = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0
  const soundObject = useRef(new Audio.Sound()).current; // Audio sound object
  const [progress, setProgress] = useState(0);
  const maxProgress = 4;

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('HomeDashboard'); // Navigate to HomeDashboard on back press
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    const playSound = async () => {
      try {
        await soundObject.loadAsync(require('../assets/raw/completed.mp3'));
        await soundObject.playAsync();
      } catch (error) {
        console.warn('Failed to load sound', error);
      }
    };

    const animate = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };

    const loadProgress = async () => {
      try {
        const storedProgress = await AsyncStorage.getItem('progress');
        if (storedProgress !== null) {
          setProgress(parseInt(storedProgress, 10));
        }
      } catch (error) {
        console.warn('Failed to load progress', error);
      }
    };

    const incrementProgress = async () => {
      try {
        const storedProgress = await AsyncStorage.getItem('progress');
        let currentProgress = storedProgress !== null ? parseInt(storedProgress, 10) : 0;
        if (currentProgress < maxProgress) {
          currentProgress += 1;
          await AsyncStorage.setItem('progress', currentProgress.toString());
          setProgress(currentProgress);
        }
      } catch (error) {
        console.warn('Failed to save progress', error);
      }
    };

    // Play sound, animate, and load progress on component mount
    playSound();
    animate();
    loadProgress().then(() => incrementProgress());

    return () => {
      // Clean up audio resources
      soundObject.stopAsync();
      soundObject.unloadAsync();
      backHandler.remove(); // Remove back handler on component unmount
    };
  }, [fadeAnim, navigation]);

  const handleDoAgain = () => {
    navigation.navigate('EyeExercise', { showAllExercises: true }); // Navigate to EyeExercise with showAllExercises set to true
  };

  const handleClearProgress = async () => {
    try {
      await AsyncStorage.removeItem('progress');
      setProgress(0); // Reset progress state
    } catch (error) {
      console.warn('Failed to clear progress', error);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.animationContainer, opacity: fadeAnim }}>
        <View style={styles.progressContainer}>
          <AnimatedCircularProgress
            size={150}
            width={20}
            fill={(progress / maxProgress) * 100} // Calculate fill percentage
            tintColor="#1B76BB"
            backgroundColor="#E0E0E0"
            rotation={0} // Start from the top
          >
            {() => (
              <Text style={styles.progressText}>{`${progress}/${maxProgress}`}</Text>
            )}
          </AnimatedCircularProgress>
        </View>
        <Text style={styles.completedText}>Exercises completed</Text>
        <Text style={styles.subText}>You have completed today's eye exercise.</Text>
        <TouchableOpacity onPress={handleDoAgain} style={styles.button}>
          <Text style={styles.buttonText}>Do it again</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClearProgress} style={styles.clearButton}>
          <Text style={styles.buttonText}>Clear Progress</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1D1D', // Adjust background color as needed
  },
  animationContainer: {
    alignItems: 'center',
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  progressText: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
    top: '42%',
  },
  completedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  subText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1B76BB',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10, // Add margin between buttons
  },
  clearButton: {
    backgroundColor: '#D9534F', // Red color for clear button
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CompletedActivity;

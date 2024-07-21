import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, BackHandler, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const CompletedActivity = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0
  const soundObject = useRef(new Audio.Sound()).current; // Audio sound object

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

    // Play sound and animate on component mount
    playSound();
    animate();

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

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.animationContainer, opacity: fadeAnim }}>
        <View style={styles.progressContainer}>
          <AnimatedCircularProgress
            size={150}
            width={15}
            fill={66} // 66% progress
            tintColor="#1B76BB"
            backgroundColor="#E0E0E0"
            rotation={0} // Start from the top
          >
            {() => (
              <Text style={styles.progressText}>2/3</Text>
            )}
          </AnimatedCircularProgress>
        </View>
        <Text style={styles.completedText}>Exercises completed</Text>
        <Text style={styles.subText}>You have completed today's eye exercise.</Text>
        <TouchableOpacity onPress={handleDoAgain} style={styles.button}>
          <Text style={styles.buttonText}>Do it again</Text>
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
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CompletedActivity;

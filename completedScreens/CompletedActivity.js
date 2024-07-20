import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, BackHandler, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

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
        <Image source={require('../assets/congo.png')} style={styles.image} />
        <Text style={styles.congratsText}>Congratulations!</Text>
        <Text style={styles.completedText}>You have completed today's eye exercise.</Text>
        <TouchableOpacity onPress={handleDoAgain} style={styles.button}>
          <Text style={styles.buttonText}>Do Again</Text>
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
  image: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 10,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  completedText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CompletedActivity;

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, BackHandler, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons for back arrow
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import RatingModal from '../components/RatingModal';

const CompletedActivity = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0
  const soundObject = useRef(new Audio.Sound()).current; // Audio sound object
  const [progress, setProgress] = useState(0);
  const maxProgress = 4;
  const [showRating, setShowRating] = useState(false);

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

    const checkFirstCompletion = async () => {
      try {
        const hasFiveStarRating = await AsyncStorage.getItem('hasFiveStarRating');
        if (hasFiveStarRating !== 'true') {
          setShowRating(true);
        }
      } catch (error) {
        console.warn('Failed to check rating status', error);
      }
    };

    // Play sound, animate, and load progress on component mount
    playSound();
    animate();
    loadProgress().then(() => {
      incrementProgress();
      checkFirstCompletion();
    });

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

  const handleRating = async (rating, isFiveStar) => {
    try {
      if (rating === 5) {
        await AsyncStorage.setItem('hasFiveStarRating', 'true');
      }
      await addDoc(collection(db, 'ratings'), {
        rating,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('Failed to save rating', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('HomeDashboard')}
      >
        <Icon name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>

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
      </Animated.View>
      <RatingModal
        visible={showRating}
        onClose={() => setShowRating(false)}
        onRate={handleRating}
      />
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
  backButton: {
    position: 'absolute',
    top: 60, // Add margin from the top
    left: 20, // Add margin from the left
    zIndex: 10, // Ensure the button is on top
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
    fontSize: 22,
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
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CompletedActivity;

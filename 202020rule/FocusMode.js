import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import BottomNavigation from '../bottomnavigationpkg/BottomNavigation';
import { useNavigation } from '@react-navigation/native';

const FocusMode = () => {
  const navigation = useNavigation();
  const [timerStarted, setTimerStarted] = useState(false); // State to track if timer is started
  const [showInfoDialog, setShowInfoDialog] = useState(false); // State to manage info dialog visibility

  const navigateToEyeExercise = (showAllExercises) => {
    navigation.navigate('EyeExercise', { showAllExercises });
  };

  const startExercise = () => {
    if (!timerStarted) {
      console.log('Please start the timer first.');
      return;
    }
    // Navigate to EyeExercise with showAllExercises set to false
    navigateToEyeExercise(false);
    console.log('Starting exercise...');
  };

  const toggleInfo = () => {
    // Functionality to toggle information display
    console.log('Toggling info...');
    setShowInfoDialog(!showInfoDialog); // Toggle info dialog visibility
  };

  const toggleTimer = () => {
    setTimerStarted(!timerStarted);
    // Additional functionality to start or pause the timer
    if (!timerStarted) {
      console.log('Starting timer...');
    } else {
      console.log('Pausing timer...');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/focusmode/meditationprogress.png')}
        style={styles.meditationImage}
        resizeMode="contain"
      />

      <View style={styles.focusModeContainer}>
        <Text style={styles.focusModeText}>20-20-20 Rule</Text>

        <TouchableOpacity onPress={toggleInfo}>
          <Image
            source={require('../assets/info.png')} // Replace with your info icon
            style={styles.infoButton}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.contentText}>
        As per eye experts, after every 20 minutes, take your eyes off from mobile screens or books and relax your eyes by doing 1 min exercise to keep your eyes healthy. Our AI feature will remind you to take this break in every 20 minutes.
      </Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showInfoDialog}
        onRequestClose={() => {
          setShowInfoDialog(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              These exercises for eyes are simple to do and easy to remember. They can be done at home or work during a few minutes of free time. Stop making excuses. Your eyes are Nature’s most special gift, and you need to preserve them to maintain your connection with the world. So, keep ’em rolling! Cheers!
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInfoDialog(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={toggleTimer} style={[styles.timerButton, { backgroundColor: timerStarted ? 'yellow' : 'red' }]}>
        <Text style={[styles.timerButtonText, { color: timerStarted ? '#333' : '#FFFFFF' }]}>
          {timerStarted ? 'PAUSE TIMER' : 'START TIMER'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={startExercise} style={[styles.startExerciseButton, { opacity: timerStarted ? 1 : 0.5 }]}>
        <Text style={styles.startExerciseText}>START EXERCISE</Text>
      </TouchableOpacity>

      <View style={styles.bottomNavigationContainer}>
        <BottomNavigation />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1E1D1D', // Adjust background color as needed
  },
  meditationImage: {
    width: 280,
    height: 280,
  },
  focusModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusModeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#EDEDED', // Adjust text color as needed
    marginRight: 10,
  },
  infoButton: {
    width: 17,
    height: 17,
    tintColor: '#FFFFFF', // Adjust icon color as needed
  },
  contentText: {
    width: '90%',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 35,
    fontSize: 15,
    color: '#FFFFFF', // Adjust text color as needed
  },
  timerButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 10,
  },
  timerButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  startExerciseButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    opacity: 0.5, // Start as disabled
  },
  startExerciseText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exerciseInfoContainer: {
    backgroundColor: '#1E1D1D',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  exerciseInfoText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#EDEDED', // Adjust text color as needed
  },
  bottomNavigationContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 50, // Adjust height to match BottomNavigation height
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#36454F',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#EDEDED',
  },
  closeButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingStart: 30,
    paddingEnd: 30,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FocusMode;

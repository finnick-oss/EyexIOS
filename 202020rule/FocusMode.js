import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Alert, Platform, Linking, AppState } from 'react-native';
import BottomNavigation from '../bottomnavigationpkg/BottomNavigation';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND_NOTIFICATION_TASK';
const TIMER_STATE_KEY = '@timer_state';

// Update notification handler for iOS
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: 'high',
  }),
});

// Register the background task
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  try {
    const timerState = await AsyncStorage.getItem(TIMER_STATE_KEY);
    console.log('Background task checking timer state:', timerState);
    
    if (timerState !== 'running') {
      console.log('Timer not running, cancelling background task');
      await Notifications.cancelAllScheduledNotificationsAsync();
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    await triggerNotification();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background task error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const triggerNotification = async () => {
  try {
    const timerState = await AsyncStorage.getItem(TIMER_STATE_KEY);
    if (timerState !== 'running') {
      console.log('Timer not running, skipping notification');
      return;
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to Take an Eye Break!',
        body: 'Do a quick eye workout to keep your eyes healthy.',
        sound: true,
        priority: 'high',
        badge: 1,
      },
      trigger: null,
    });
    console.log('Notification triggered!');
  } catch (error) {
    console.error('Error triggering notification:', error);
  }
};

const FocusMode = () => {
  const navigation = useNavigation();
  const [timerStarted, setTimerStarted] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(null);
  const [timerId, setTimerId] = useState(null);

  // Load timer state when component mounts
  useEffect(() => {
    loadTimerState();
    return () => {
      cleanupTasks();
    };
  }, []);

  const loadTimerState = async () => {
    try {
      const savedState = await AsyncStorage.getItem(TIMER_STATE_KEY);
      if (savedState === 'running') {
        startFiveMinuteTimer(false);
      }
    } catch (error) {
      console.error('Error loading timer state:', error);
    }
  };

  const cleanupTasks = async () => {
    try {
      // Clear interval
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
      }
      
      // Cancel notifications
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      console.log('Cleanup completed');
    } catch (error) {
      console.error('Error in cleanup:', error);
    }
  };

  const registerBackgroundTask = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
        minimumInterval: 3, // 3 seconds for testing
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
      });
      console.log('Background task registered');
    } catch (error) {
      if (error.message !== 'Task is already registered') {
        console.log('Task registration failed:', error);
      }
    }
  };

  const startFiveMinuteTimer = async (shouldRegisterTask = true) => {
    setTimerStarted(true);
    await AsyncStorage.setItem(TIMER_STATE_KEY, 'running');

    if (shouldRegisterTask) {
      await registerBackgroundTask();
    }

    const timer = setInterval(() => {
      triggerNotification();
    }, 20*60*1000); // 3 seconds for testing

    setTimerId(timer);
  };

  const toggleTimer = async () => {
    if (!timerStarted) {
      if (permissionGranted === null || permissionGranted === false) {
        const permissionStatus = await requestNotificationPermissions();
        if (!permissionStatus) {
          Alert.alert(
            'Permission Denied',
            'Please allow notifications to start the timer.',
            [
              { text: 'Retry', onPress: requestNotificationPermissions },
              { text: 'Open Settings', onPress: openSettings },
            ]
          );
          return;
        }
      }
      // Start timer
      await AsyncStorage.setItem(TIMER_STATE_KEY, 'running');
      startFiveMinuteTimer();
    } else {
      try {
        // Stop timer
        console.log('Stopping timer...');
        
        // Clear interval first
        if (timerId) {
          clearInterval(timerId);
          setTimerId(null);
        }

        // Update state
        await AsyncStorage.setItem(TIMER_STATE_KEY, 'stopped');
        setTimerStarted(false);
        
        // Cancel all notifications
        await Notifications.cancelAllScheduledNotificationsAsync();
        
        console.log('Timer successfully stopped');
      } catch (error) {
        console.error('Error stopping timer:', error);
      }
    }
  };

  useEffect(() => {
    // Check and update the permission status on component mount
    const checkPermissionStatus = async () => {
      try {
        const permissionStatus = await AsyncStorage.getItem('notificationPermission');
        if (permissionStatus !== null) {
          setPermissionGranted(JSON.parse(permissionStatus)); // Set state based on saved permission status
        } else {
          setPermissionGranted(false); // Default state if no status found
        }
      } catch (error) {
        console.error('Error retrieving permission status:', error);
      }
    };

    checkPermissionStatus();
  }, []);

  const navigateToEyeExercise = (showAllExercises) => {
    navigation.navigate('EyeExercise', { showAllExercises });
  };

  const startExercise = () => {
    if (!timerStarted) {
      console.log('Please start the timer first.');
      return;
    }
    navigateToEyeExercise(false);
    console.log('Starting exercise...');
  };

  const toggleInfo = () => {
    setShowInfoDialog(!showInfoDialog); // Toggle info dialog visibility
  };

  const requestNotificationPermissions = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        console.log('Notification permission granted.');
        await AsyncStorage.setItem('notificationPermission', JSON.stringify(true));
        setPermissionGranted(true);
        return true;
      } else {
        console.log('Notification permission denied.');
        Alert.alert(
          'Notification Permission',
          'You need to allow notifications to get reminders.',
          [{ text: 'OK' }]
        );
        await AsyncStorage.setItem('notificationPermission', JSON.stringify(false));
        setPermissionGranted(false);
        return false;
      }
    }
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  // Add this useEffect to handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        const timerState = await AsyncStorage.getItem(TIMER_STATE_KEY);
        console.log('App became active, timer state:', timerState);
        setTimerStarted(timerState === 'running');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Add cleanup effect
  useEffect(() => {
    return () => {
      cleanupTasks();
    };
  }, []);

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
            source={require('../assets/info.png')}
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
    color: '#EDEDED', // Adjust text color
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FocusMode;

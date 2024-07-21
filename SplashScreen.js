import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ToastAndroid, Text } from 'react-native';
import { useTheme } from './themes/ThemeContext';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation(); // Use useNavigation hook to get navigation object

  const showToast = () => {
    ToastAndroid.show('Already selected data', ToastAndroid.SHORT);
  };

  useEffect(() => {
    // Simulate some initialization tasks or network requests
    const initializeApp = async () => {
      // Example: Wait for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if both the issue and time are saved
      const issue = await AsyncStorage.getItem('selectedIssue');
      const time = await AsyncStorage.getItem('selectedTime');

      // Navigate based on the existence of both values
      if (issue && time) {
        navigation.navigate('HomeDashboard'); // Navigate to HomeDashboard if both values exist
        showToast();
      } else {
        navigation.navigate('SelectIssue'); // Navigate to SelectIssue if either value is missing
      }

      
    };

    initializeApp();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Image
          source={require('./assets/applogo.jpg')}
          style={styles.image}
        />
      </View>
      <View style={{ flex: 0.15, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, color: theme.colors.gnt_outline }}>Complete eye care solutions</Text>
        <Text style={{ fontSize: 14, color: theme.colors.greyWhite, textAlign: 'center', marginTop: 5 }}>Powered by anvelopers.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E1D1D', // Change to your desired background color
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain', // Adjust based on your image aspect ratio
  },
});

export default SplashScreen;

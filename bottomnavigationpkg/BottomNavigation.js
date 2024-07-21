import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const BottomNavigation = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('Home'); // State to track selected tab

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
    setSelectedTab(screenName); // Update selected tab when navigating
  };

  return (
    <LinearGradient
      colors={['#36454F', '#0000d']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <TouchableOpacity onPress={() => navigateToScreen('HomeDashboard')} style={styles.icon}>
        <Image source={require('../assets/bottomnavigation/home.png')} style={[styles.iconImage, selectedTab === 'Home' && styles.selectedIcon]} />
        <Text style={[styles.iconText, selectedTab === 'Home' && styles.selectedText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('FocusMode')} style={styles.icon}>
        <Image source={require('../assets/bottomnavigation/focusmode.png')} style={[styles.iconImage, selectedTab === 'EyeExercise' && styles.selectedIcon]} />
        <Text style={[styles.iconText, selectedTab === 'EyeExercise' && styles.selectedText]}>20-20-20</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('CompletedActivity')} style={styles.icon}>
        <Image source={require('../assets/bottomnavigation/healthtips.png')} style={[styles.iconImage, selectedTab === 'HealthTips' && styles.selectedIcon]} />
        <Text style={[styles.iconText, selectedTab === 'HealthTips' && styles.selectedText]}>Health Tips</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width:'90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 1, // for Android shadow
  },
  icon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 25,
    height: 25,
    tintColor: '#EDEDED', // Apply grey tint to images
  },
  selectedIcon: {
    tintColor: '#EDEDED', // Light blue color for selected tab
  },
  iconText: {
    color: 'white',
    fontSize: 10,
    marginTop: 3, // Adjust as needed for spacing
  },
  selectedText: {
    color: '#EDEDED', // Light blue color for selected tab text
  },
});

export default BottomNavigation;

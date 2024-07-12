import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../themes/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const HomeDashboard = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const navigateToEyeExercise = () => {
    navigation.navigate('EyeExercise'); // Navigate to the EyeExercise screen
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.gnt_outline }]}>Hi user</Text>
      <Text style={[styles.quote, { color: theme.colors.gnt_outline }]}>Good day to start exercise.</Text>

      <ScrollView>
        <Text style={[styles.cardTitle, { color: theme.colors.gnt_outline }]}>Eye Exercise</Text>
        <TouchableOpacity onPress={navigateToEyeExercise}>
          <View style={styles.card}>
            <Image source={require('../assets/dashboardassets/speciallyforyou.jpg')} style={styles.image} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToEyeExercise}>
          <View style={styles.card}>
            <Image source={require('../assets/dashboardassets/fulleyeexercise.jpg')} style={styles.image} />
          </View>
        </TouchableOpacity>

        <Text style={[styles.cardTitle, { color: theme.colors.gnt_outline }]}>Health Tips</Text>
        <View style={styles.card}>
          <Image source={require('../assets/dashboardassets/healthtips.jpg')} style={styles.image} />
        </View>

        <Text style={[styles.cardTitle, { color: theme.colors.gnt_outline }]}>Focus Mode</Text>
        <View style={styles.card}>
          <Image source={require('../assets/dashboardassets/focusmode.jpg')} style={styles.image} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
  },
  quote: {
    fontSize: width * 0.04,
    marginBottom: height * 0.05,
  },
  card: {
    width: width * 0.9,
    marginBottom: height * 0.02,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: width * 0.05,
    padding: width * 0.03,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: height * 0.2,
    resizeMode: 'cover',
  },
});

export default HomeDashboard;

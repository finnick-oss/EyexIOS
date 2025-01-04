import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../themes/ThemeContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BottomNavigation from '../bottomnavigationpkg/BottomNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const { width, height } = Dimensions.get('window');

const HomeDashboard = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const maxProgress = 4;

  useFocusEffect(
    React.useCallback(() => {
      const fetchProgress = async () => {
        try {
          const storedDate = await AsyncStorage.getItem('lastUpdatedDate');
          const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

          if (storedDate !== currentDate) {
            // Reset progress if the date is different
            await AsyncStorage.setItem('progress', '0');
            await AsyncStorage.setItem('lastUpdatedDate', currentDate);
            setProgress(0);
          } else {
            // Fetch stored progress if the date is the same
            const storedProgress = await AsyncStorage.getItem('progress');
            if (storedProgress !== null) {
              setProgress(parseInt(storedProgress, 10));
            }
          }
        } catch (error) {
          console.warn('Failed to fetch progress', error);
        }
      };

      fetchProgress();
    }, [])
  );

  const navigateToEyeExercise = (showAllExercises) => {
    navigation.navigate('EyeExercise', { showAllExercises });
  };

  const navigateToOtherTabs = (tab) => {
    navigation.navigate(tab);
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Great job! Keep up the good work.",
      "You're doing amazing! Stay focused.",
      "Fantastic effort! Keep pushing forward.",
      "You're on fire! Keep the momentum going.",
    ];
    return quotes[progress % quotes.length];
  };

  const getQuoteColor = () => {
    const colors = [
      "#FF5733", // Color for 0 progress
      "#FF8D1A", // Color for 1 progress
      "#FFBF00", // Color for 2 progress
      "#9CFF00", // Color for 3 progress
      "#00FF99", // Color for 4 progress
    ];
    return colors[progress] || "#000000"; // Fallback to black if progress is out of range
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <ScrollView style={styles.cardScrollView} showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>

        <Text style={[styles.title, { color: theme.colors.gnt_outline }]}>Hi user</Text>
        <Text style={[styles.quote, { color: theme.colors.gnt_outline }]}>Good day to start exercise.</Text>

        <View style={[styles.progressCard, { backgroundColor: theme.colors.gnt_darkgrey }]}>
          
          <View style={styles.progressLeft}>
            <AnimatedCircularProgress
              size={100}
              width={15}
              fill={(progress / maxProgress) * 100} // Calculate fill percentage
              tintColor="#07c8f9"
              backgroundColor="#636363"
              rotation={0} // Start from the top
            >
              {() => (
                <Text style={styles.progressText}>{`${progress}/${maxProgress}`}</Text>
              )}
            </AnimatedCircularProgress>
          </View>

          <View style={styles.progressRight}>
            <Text style={[styles.motivationalQuote, { color: getQuoteColor() }]}>
              {getMotivationalQuote()}
            </Text>
          </View>

        </View>

        <Text style={[styles.cardTitle, { color: theme.colors.gnt_outline }]}>Eye Exercise</Text>
        <TouchableOpacity onPress={() => navigateToEyeExercise(false)}>
          <View style={styles.card}>
            <Image source={require('../assets/dashboardassets/speciallyforyou.jpg')} style={styles.image} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateToEyeExercise(true)}>
          <View style={styles.card}>
            <Image source={require('../assets/dashboardassets/fulleyeexercise.jpg')} style={styles.image} />
          </View>
        </TouchableOpacity>

        <Text style={[styles.cardTitle, { color: theme.colors.gnt_outline }]}>Health Tips</Text>
        <TouchableOpacity onPress={() => navigateToOtherTabs('HealthTips')}>
        <View style={styles.card}>
          <Image source={require('../assets/dashboardassets/healthtips.jpg')} style={styles.image} />
        </View>
        </TouchableOpacity>

        <Text style={[styles.cardTitle, { color: theme.colors.gnt_outline }]}>Focus Mode</Text>
        <TouchableOpacity onPress={() => navigateToOtherTabs('FocusMode')}>
        <View style={styles.card}>
          <Image source={require('../assets/dashboardassets/focusmode.jpg')} style={styles.image} />
        </View>
        </TouchableOpacity>

        <Text style={[styles.cardTitle, { color: theme.colors.gnt_outline }]}>Diet Plan</Text>
<View style={styles.card}>
  <Image source={require('../assets/dashboardassets/dietplan.jpg')} style={styles.image} />
  {/* Show Diet Plan Button */}
  <TouchableOpacity style={styles.showDietButton} onPress={() => {navigateToOtherTabs('DietPlan')}}>
    <Text style={styles.showDietText}>Show Diet Plan</Text>
  </TouchableOpacity>
</View>



      </ScrollView>

      <View style={styles.bottomNavigationContainer}>
        <BottomNavigation />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    paddingTop: height * 0.08,
  },

  cardScrollView: {
    marginBottom: 70,
  },

  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
  },
  quote: {
    fontSize: width * 0.04,
    marginBottom: height * 0.05,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
    width: width * 0.9,
    borderRadius: 15,
    overflow: 'hidden',
    padding: 15,
  },
  progressLeft: {
    flex: 1,
    marginEnd: 5,
  },
  progressRight: {
    flex: 1.6,
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  motivationalQuote: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
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
  showDietButton: {
    position: 'absolute',
    bottom: 10, // Adjust based on the size of the card
    left: 10,   // Adjust to position it to the left
    backgroundColor: 'red', // Set the background color to red
    borderRadius: 25, // Round the corners
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showDietText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },  
  bottomNavigationContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 50, // Adjust height to match BottomNavigation height
  },
});

export default HomeDashboard;

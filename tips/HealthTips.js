import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { app } from '../firebase/firebaseConfig'; // Adjust the path if necessary
import { useTheme } from '../themes/ThemeContext';
import BottomNavigation from '../bottomnavigationpkg/BottomNavigation';
import { useNavigation } from '@react-navigation/native';

const db = getDatabase(app);

const HealthTips = () => {
  const navigation = useNavigation();
  const [tipsData, setTipsData] = useState([]);
  const theme = useTheme(); // to use the theme

  useEffect(() => {
    const fetchData = async () => {
      const tipsRef = ref(db, '/HealthTipsForPremium');

      onValue(tipsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const tipsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setTipsData(tipsArray);
        }
      });

      // Clean up listener when component unmounts
      return () => {
        off(tipsRef);
      };
    };

    fetchData();
  }, []);

  const handleSourceLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred while opening the link', err));
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('HealthTipsFD', { tipId: item.id })}>
      <View style={[styles.card, { backgroundColor: theme.colors.greyWhite }]}>
        <Image source={{ uri: item.images }} style={styles.cardImage} />
        <View style={styles.cardDescription}>
          <Text style={[styles.title, { color: theme.colors.gnt_outline }]}>{item.title}</Text>
          <Text style={[styles.description, { color: theme.colors.gnt_outline }]} numberOfLines={2} ellipsizeMode="tail">
            {item.description}
          </Text>
          {/* Add source link if available */}
          {item.source && (
            <TouchableOpacity onPress={() => handleSourceLink(item.source)}>
              <Text style={[styles.sourceText, { color: theme.colors.linkColor }]}>Tips source</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[{ backgroundColor: theme.colors.background, flex: 1 }]}>
      {/* Header with increased padding */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.headerText, { color: theme.colors.gnt_outline }]}>Health Tips</Text>
      </View>

      {/* FlatList without overlapping the bottom navigation */}
      <FlatList
        data={tipsData}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigationContainer}>
        <BottomNavigation />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 30, // Increased padding for the header
    paddingLeft: 20,
    paddingTop: 30, // Added more top padding for the heading
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingBottom: 90, // Ensure there is enough space for the bottom navigation
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
  },
  cardImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  cardDescription: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
  },
  sourceText: {
    fontSize: 12,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  bottomNavigationContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50, // Adjust height to match BottomNavigation height
  },
});

export default HealthTips;

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
      {/* Header with safe area padding */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.headerText, { color: theme.colors.gnt_outline }]}>Health Tips</Text>
      </View>

      <FlatList
        data={tipsData}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomNavigationContainer}>
        <BottomNavigation />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60, // Increased top padding for dynamic island
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingHorizontal: 16, // Added horizontal padding
    paddingBottom: 90, // Space for bottom navigation
  },
  card: {
    marginBottom: 20,
    borderRadius: 15, // Increased border radius
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 2, // Added horizontal margin
  },
  cardImage: {
    width: '100%',
    height: 200, // Reduced height slightly
    resizeMode: 'cover',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardDescription: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  sourceText: {
    fontSize: 12,
    textDecorationLine: 'underline',
    marginTop: 12,
  },
  bottomNavigationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
});

export default HealthTips;

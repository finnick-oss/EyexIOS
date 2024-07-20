import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { app } from '../firebase/firebaseConfig'; // Adjust the path if necessary
import { useTheme } from '../themes/ThemeContext';
import BottomNavigation from '../bottomnavigationpkg/BottomNavigation';
import { TouchableOpacity } from 'react-native';
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

  const renderCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('HealthTipsFD', { tipId: item.id })}>
      <View style={[styles.card, { backgroundColor: theme.colors.greyWhite }]}>
        <Image source={{ uri: item.images }} style={styles.cardImage} />
        <View style={styles.cardDescription}>
          <Text style={[styles.title, { color: theme.colors.gnt_outline }]}>{item.title}</Text>
          <Text style={[styles.description, { color: theme.colors.gnt_outline }]} numberOfLines={2} ellipsizeMode="tail">
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );


  return (
    <>
    
    <View style={[ { backgroundColor: theme.colors.background }]}>
    <ScrollView>
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.headerText, { color: theme.colors.gnt_outline }]}>Health Tips</Text>
      </View>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <FlatList
          data={tipsData}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
        />
      </View>
      </ScrollView>
      
      <View style={styles.bottomNavigationContainer}>
        <BottomNavigation />
      </View>


      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 15,
    paddingLeft: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 20,
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

  bottomNavigationContainer: {
    alignItems:'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 50, // Adjust height to match BottomNavigation height
  },

});

export default HealthTips;

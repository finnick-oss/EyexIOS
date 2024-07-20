import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import { useTheme } from '../themes/ThemeContext';
import CustomButton from './CustomButton';


const db = getDatabase(app);

const HealthTipsFD = ({ route, navigation }) => {
  const { tipId } = route.params;
  const [currentTipId, setCurrentTipId] = useState(tipId);
  const [tipData, setTipData] = useState(null);
  const theme = useTheme(); // to use the theme

  useEffect(() => {
    const fetchData = async (id) => {
      const tipRef = ref(db, `/HealthTipsForPremium/${id}`);
      onValue(tipRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setTipData(data);
        }
      });

      // Clean up listener when component unmounts
      return () => {
        off(tipRef);
      };
    };

    fetchData(currentTipId);
  }, [currentTipId]);

  const handleNext = () => {
    const nextId = parseInt(currentTipId, 10) + 1;
    setCurrentTipId(nextId.toString());
  };

  const handlePrevious = () => {
    const prevId = parseInt(currentTipId, 10) - 1;
    if (prevId > 0) {
      setCurrentTipId(prevId.toString());
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {tipData && (
        <>
          <Image source={{ uri: tipData.images }} style={styles.image} />
          <ScrollView>
          <Text style={[styles.title, { color: theme.colors.gnt_outline }]}>{tipData.title}</Text>
          <Text style={[styles.fulldescription, { color: theme.colors.gnt_outline }]}>{tipData.Fulldescription}</Text>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <CustomButton title="Previous" onPress={handlePrevious} disabled={currentTipId === "1"} />
            <CustomButton title="Next" onPress={handleNext} />
        </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fulldescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default HealthTipsFD;

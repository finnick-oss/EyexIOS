import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ToastAndroid, FlatList, TouchableOpacity, BackHandler, Dimensions } from 'react-native';
import { useTheme } from '../themes/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SelectTime = () => {
    const theme = useTheme(); // to use the theme
    const navigation = useNavigation();

    const times = [
        '1-2 hours',
        '2-4 hours',
        '4-8 hours',
        'More than 8 hours'
    ]; // Time options

    // to hold the user state
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, []);

    const handleTimePress = (item) => {
        setSelectedTime(item);
    };

    const saveSelectedTime = async (item) => {
        if (item != null) {
            // Save the selected time to AsyncStorage
            try {
                await AsyncStorage.setItem('selectedTime', item);
                ToastAndroid.show('Time saved successfully!', ToastAndroid.SHORT);
                navigation.navigate('LoadData'); // Change to the actual next screen
            } catch (error) {
                console.error('Error saving time:', error);
            }
        } else {
            ToastAndroid.show('Please select the time', ToastAndroid.SHORT);
        }
    };

    return (
        <View style={[Styles.maincontainer, { backgroundColor: theme.colors.background }]}>
            <View style={Styles.timesContainer}>
                <Text style={[Styles.headerText, { color: theme.colors.gnt_outline }]}>
                    How much time are you spending on devices daily?
                </Text>

                <View style={{ marginTop: 20, marginBottom: 20, flex: 1 }}>
                    <FlatList
                        data={times}
                        renderItem={({ item }) => (
                            <Text
                                style={[
                                    Styles.timeText,
                                    selectedTime === item && {
                                        backgroundColor: theme.colors.gnt_blue,
                                        color: theme.colors.white
                                    },
                                    { fontSize: width * 0.04 }
                                ]}
                                onPress={() => handleTimePress(item)}
                            >
                                {item}
                            </Text>
                        )}
                        numColumns={1} // Display 1 column
                        keyExtractor={(item, index) => index.toString()} // Use index as the key
                    />
                </View>

                <View style={{ flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => saveSelectedTime(selectedTime)}
                        style={[Styles.submitButton, { backgroundColor: theme.colors.gnt_blue }]}>
                        <Text style={[Styles.submitButtonText, { color: theme.colors.gnt_outline }]}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const Styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        padding: width * 0.08,
        alignItems: 'flex-start',
    },
    timesContainer: {
        marginTop: 20,
        flex: 1,
        width: '100%'
    },
    headerText: {
        fontSize: width * 0.05,
        flexWrap: 'wrap'
    },
    timeText: {
        backgroundColor: '#e0e0e0', // Grey background color
        padding: width * 0.05,
        marginTop: 5,
        marginBottom: 5,
        marginEnd: 5,
        borderRadius: 20, // Rounded corners
        color: 'black', // Text color
        flexWrap: 'wrap',
        width: '60%',
    },
    submitButton: {
        borderRadius: 8,
        paddingVertical: width * 0.03,
        paddingHorizontal: width * 0.1,
        alignItems: 'center'
    },
    submitButtonText: {
        fontSize: width * 0.05,
        flexWrap: 'wrap'
    }
});

export default SelectTime;

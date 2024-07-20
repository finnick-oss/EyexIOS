import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ToastAndroid, FlatList, TouchableOpacity, BackHandler, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig'; // Assuming your firebaseConfig.js is in the same directory
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '../themes/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const db = getFirestore(app);

const SelectIssue = () => {
    const theme = useTheme(); // to use the theme
    const navigation = useNavigation();

    // const issues = [
    //     'myopia',
    //     'dry eye',
    //     'lazy eye',
    //     'eye pain',
    //     'dark circles',
    //     'tired eyes',
    //     'improve vision',
    //     'double vision',
    //     'gaming use'
    // ];  // to upload the issue

    // // to hold the user state
    // const [index, setIndex] = useState(0);
    
    const [fetchedIssues, setFetchedIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        checkInternetConnection();

        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, []);

    const checkInternetConnection = async () => {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            Alert.alert(
                "No Internet Connection",
                "Please check your internet connection and try again.",
                [{ text: "OK", onPress: () => BackHandler.exitApp() }]
            );
        } else {
            fetchIssuesFromFirebase();
        }
    };

    // const uploadIssueToFirebase = async (issue) => {
    //     const location = 'EyeConditions'; // Collection name
    //     try {
    //         const docRef = await addDoc(collection(db, location), {
    //             name: issue
    //         });
    //         console.log('Document written with ID: ', docRef.id);
    //     } catch (error) {
    //         console.error('Error adding document: ', error);
    //     }
    // };

    const fetchIssuesFromFirebase = async () => {
        const location = 'EyeConditions'; // Collection name
        try {
            const querySnapshot = await getDocs(collection(db, location));
            const issuesFromFirestore = querySnapshot.docs.map(doc => doc.data().name);
            setFetchedIssues(issuesFromFirestore);
        } catch (error) {
            console.error('Error fetching issues: ', error);
        } finally {
            setLoading(false); // Set loading to false once data is fetched
        }
    };

    // const handleUpload = () => {
    //     uploadIssueToFirebase(issues[index]);
    //     setIndex((prevIndex) => (prevIndex + 1) % issues.length);
    // };

    const handleIssuePress = (item) => {
        setSelectedIssue(item);
    };

    const saveSelectedIssue = async (item) => {
        if (item != null) {
            // Save the selected issue to AsyncStorage
            try {
                await AsyncStorage.setItem('selectedIssue', item);
                ToastAndroid.show('Issue saved successfully!', ToastAndroid.SHORT);
                navigation.navigate('SelectTime');
            } catch (error) {
                console.error('Error saving issue:', error);
            }
        } else {
            ToastAndroid.show('Please select the issue', ToastAndroid.SHORT);
        }
    };

    return (
        <View style={[Styles.maincontainer, { backgroundColor: theme.colors.background }]}>
            <View style={Styles.fetchedIssuesContainer}>
                <Text style={{ color: theme.colors.gnt_outline, fontSize: width * 0.05 }}>
                    Select any one of the options according to your diagnosis/issue.
                </Text>

                <View style={{ marginTop: 20, marginBottom: 20, flex: 1 }}>
                    {loading ? (
                        <View style={Styles.loaderContainer}>
                            <ActivityIndicator size="large" color={theme.colors.gnt_blue} />
                        </View>
                    ) : (
                        <FlatList
                            data={fetchedIssues}
                            renderItem={({ item }) => (
                                <Text
                                    style={[
                                        Styles.issueText,
                                        selectedIssue === item && {
                                            backgroundColor: theme.colors.gnt_blue,
                                            color: theme.colors.white
                                        },
                                        { fontSize: width * 0.04 }
                                    ]}
                                    onPress={() => {
                                        handleIssuePress(item);
                                    }}
                                >
                                    {item}
                                </Text>
                            )}
                            numColumns={2} // Display 2 columns in the grid
                            keyExtractor={(item, index) => index.toString()} // Use index as the key
                        />
                    )}
                </View>

                <View style={{ flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => saveSelectedIssue(selectedIssue)}
                        style={[Styles.submitButton, { backgroundColor: theme.colors.gnt_blue }]}>

                        <Text style={{
                            color: theme.colors.gnt_outline,
                            fontSize: width * 0.05
                        }}>Submit</Text>

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
    fetchedIssuesContainer: {
        marginTop: 20,
        flex: 1, // Make sure the container takes full height
    },
    loaderContainer: {
        flex: 1, // Take full height of the parent
        justifyContent: 'center',
        alignItems: 'center'
    },
    issueText: {
        backgroundColor: '#e0e0e0', // Grey background color
        padding: width * 0.04,
        marginTop: 5,
        marginBottom: 5,
        marginEnd: 5,
        borderRadius: 20, // Rounded corners
        color: 'black' // Text color
    },
    submitButton: {
        borderRadius: 8,
        paddingVertical: width * 0.02,
        paddingHorizontal: width * 0.2,
        alignItems: 'center'
    }
});

export default SelectIssue;

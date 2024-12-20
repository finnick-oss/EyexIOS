import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    BackHandler,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '../themes/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const db = getFirestore(app);

const SelectIssue = () => {
    const theme = useTheme();
    const navigation = useNavigation();

    const [fetchedIssues, setFetchedIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const fetchIssuesFromFirebase = async () => {
        const location = 'EyeConditions'; // Collection name
        try {
            const querySnapshot = await getDocs(collection(db, location));
            const issuesFromFirestore = querySnapshot.docs.map(doc => doc.data().name);
            setFetchedIssues(issuesFromFirestore);
        } catch (error) {
            console.error('Error fetching issues: ', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIssuePress = (item) => {
        setSelectedIssue(item);
    };

    const saveSelectedIssue = async (item) => {
        if (item != null) {
            try {
                await AsyncStorage.setItem('selectedIssue', item);
                navigation.navigate('SelectTime');
            } catch (error) {
                console.error('Error saving issue:', error);
            }
        } else {
        }
    };

    return (
        <View style={[styles.mainContainer, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.headerText, { color: theme.colors.gnt_outline }]}>
                Select any one of the options according to your diagnosis/issue.
            </Text>
    
            {/* FlatList Container */}
            <View style={styles.flatListContainer}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={theme.colors.gnt_blue} />
                    </View>
                ) : (
                    <FlatList
                        data={fetchedIssues}
                        renderItem={({ item }) => (
                            <Text
                                style={[
                                    styles.issueText,
                                    selectedIssue === item && {
                                        backgroundColor: theme.colors.gnt_blue,
                                        color: theme.colors.white,
                                    },
                                ]}
                                onPress={() => handleIssuePress(item)}
                            >
                                {item}
                            </Text>
                        )}
                        numColumns={2} // Grid layout with 2 columns
                        keyExtractor={(item, index) => index.toString()}
                    />
                )}
            </View>
    
            {/* Button Container */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => saveSelectedIssue(selectedIssue)}
                    style={[styles.submitButton, { backgroundColor: theme.colors.gnt_blue }]}
                >
                    <Text style={[styles.submitButtonText, { color: theme.colors.gnt_outline }]}>
                        Submit
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.10, // Adjusted padding
    },
    headerText: {
        fontSize: width * 0.05,
        textAlign: 'center',
        marginBottom: height * 0.02, // Space below header
    },
    flatListContainer: {
        flexGrow: 0, // Ensures FlatList takes only the required height
        marginBottom: height * 0.02, // Space below the FlatList
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    issueText: {
        backgroundColor: '#e0e0e0',
        padding: width * 0.04,
        margin: width * 0.02,
        borderRadius: 20,
        textAlign: 'center',
        color: 'black',
        flex: 1,
    },
    buttonContainer: {
        alignItems: 'flex-start', // Align button to the left
        marginTop: height * 0.01, // Small spacing above the button
        paddingLeft: width * 0.05, // Optional: Add padding to adjust the left spacing
    },
    
    submitButton: {
        borderRadius: 8,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.2,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
});


export default SelectIssue;

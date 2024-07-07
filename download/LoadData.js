import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useTheme } from '../themes/ThemeContext';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import ProgressBar from './ProgressBar'; // Import the ProgressBar component

const { width, height } = Dimensions.get('window');

const LoadData = () => {
    const theme = useTheme();
    const navigation = useNavigation(); // Get the navigation object

    const handleProgressComplete = () => {
        navigation.navigate('HomeDashboard'); // Navigate to HomeDashboard
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Image
                style={styles.gif}
                source={require('../assets/gif/transformation.gif')}
                resizeMode="contain"
            />

            <View style={styles.relativeLayout}>
                {/* Uncomment and replace with appropriate slider component if needed */}
                {/* <SliderComponent style={styles.slider} /> */}
            </View>

            <View style={styles.textContainer}>
                <Text style={[styles.text, styles.title, { color: theme.colors.gnt_outline }]}>Please wait</Text>
                <Text style={[styles.text, styles.subtitle, { color: theme.colors.gnt_outline }]}>
                    We are customizing all the exercises according to your lifestyle and eyecare needs.
                </Text>

                <View style={styles.progressBar}>
                    <ProgressBar onComplete={handleProgressComplete} />
                </View>

                <Text style={[styles.text, { color: theme.colors.gnt_outline }]}>Loading...</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: width * 0.08,
    },
    card: {
        marginTop: height * 0.02,
        marginBottom: height * 0.02,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gif: {
        width: '100%',
        height: height * 0.3,
    },
    relativeLayout: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: width * 0.1,
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: width * 0.08,
    },
    text: {
        textAlign: 'center',
        marginVertical: height * 0.01,
    },
    title: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: width * 0.04,
    },
    progressBar: {
        marginTop: height * 0.015,
        padding: width * 0.02,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LoadData;

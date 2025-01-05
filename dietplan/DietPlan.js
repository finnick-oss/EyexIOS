import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DietPlan = () => {
  const [pdfUri, setPdfUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [webViewLoading, setWebViewLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const pdfAsset = Asset.fromModule(require('../assets/dietplan/Eye-nutrition-tips-and-exercises.pdf'));
        await pdfAsset.downloadAsync();
        const fileUri = pdfAsset.localUri || pdfAsset.uri;
        setPdfUri(fileUri);
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('HomeDashboard')}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {(isLoading || webViewLoading) && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      
      {pdfUri && (
        <View style={[styles.pdfContainer, webViewLoading ? { opacity: 0 } : { opacity: 1 }]}>
          <WebView
            onLoadStart={() => setWebViewLoading(true)}
            onLoadEnd={() => setWebViewLoading(false)}
            originWhitelist={['*']}
            source={{ uri: pdfUri }}
            style={styles.webview}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 0,
  },
  pdfContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
  },
});

export default DietPlan;

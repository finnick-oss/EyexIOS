import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const DietPlan = () => {
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      // Load the PDF asset from the assets folder
      const pdfAsset = Asset.fromModule(require('../assets/dietplan/Eye-nutrition-tips-and-exercises.pdf'));
      await pdfAsset.downloadAsync(); // Ensure the asset is downloaded

      const fileUri = pdfAsset.localUri || pdfAsset.uri; // Get the URI of the downloaded PDF
      setPdfUri(fileUri);

      // Check the file size using expo-file-system
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      console.log("PDF File Size:", fileInfo.size, "bytes");
    };

    loadPdf(); // Load the PDF when the component mounts
  }, []);

  const togglePdfView = () => {
    setShowPdf((prev) => !prev); // Toggle to show or hide the PDF
  };

  return (
    <View style={styles.container}>
      <Button title="View Diet Plan" onPress={togglePdfView} />

      {/* Show the PDF when toggled and URI is available */}
      {showPdf && pdfUri && (
        <WebView
          originWhitelist={['*']}
          source={{ uri: `file://${pdfUri}` }} // Make sure to use 'file://' URI for local assets
          style={{ flex: 1, width: '100%', height: '100%' }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DietPlan;

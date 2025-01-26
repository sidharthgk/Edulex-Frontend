import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { useFonts } from 'expo-font';

const HandWritingTest = ({ navigation }: any) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Writing Paragraph Box */}
      <View style={styles.paragraphBox}>
        <Text style={styles.paragraph}>
          Please write the following sentence on a piece of paper and show it to the camera:
          "The quick brown fox jumps over the lazy dog."
        </Text>
      </View>

      {/* Show photo if available */}
      {photoUri && (
        <View style={styles.cameraPlaceholder}>
          <Image
            style={styles.camera}
            source={{ uri: photoUri }}
          />
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonTakePhoto]}
          onPress={() => navigation.navigate('PhotoCamera', { setPhotoUri })}
        >
          <Text style={styles.actionButtonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF', // Match the background color
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  cameraPlaceholder: {
    width: 300,
    height: 300,
    borderRadius: 150, // Circle (half of 300)
    backgroundColor: '#FFFFFF', // White background for the camera area
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3DB2FF', // Blue border
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  paragraphBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    borderWidth: 1.5,
    borderColor: '#3DB2FF', // Blue border
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 20,
    lineHeight: 28,
    color: '#333333', // Dark text for readability
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  actionButtonTakePhoto: {
    backgroundColor: '#3DB2FF', // Orange
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default HandWritingTest;

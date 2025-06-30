import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

const DyslexiaTestStart = ({ navigation }: any) => {
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-itallic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      {/* Icon Section */}
      <Image
        source={require('../../../assets/images/instructions-model.png')} // Path to the icon
        style={styles.icon}
      />

      {/* Instructions */}
      <Text style={styles.title}>Welcome to the Dyslexia Test</Text>
      <Text style={styles.instructions}>
        This test will help us understand your learning needs better. Please follow the
        instructions carefully, and make sure you're in a quiet environment.
      </Text>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('DyslexiaTestInstructions')} // Navigate to the next page
        >
          <Text style={styles.startButtonText}>Start Assessment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('SkipAssessmentConfirmation')} // Navigate to confirmation
        >
          <Text style={styles.skipButtonText}>Skip for Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF', // White background
  },
  icon: {
    width: 500,
    height: 400,
    resizeMode: 'contain',
    marginTop: -90,
  },
  title: {
    fontSize: 24,
    color: '#3DB2FF', // Blue color for the title
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Bold', // Dyslexic-friendly font
    marginTop: -20,
  },
  instructions: {
    fontSize: 16,
    color: '#6B7280', // Light gray for secondary text
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Regular', // Dyslexic-friendly font
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  startButton: {
    backgroundColor: '#3DB2FF', // Blue background for the button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
    width: '80%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF', // White text for the button
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold', // Dyslexic-friendly font
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3DB2FF',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#3DB2FF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
  },
});

export default DyslexiaTestStart;

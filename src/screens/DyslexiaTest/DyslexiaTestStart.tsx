import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

const DyslexiaTestStart = ({ navigation }: any) => {
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-itallic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      {/* Icon Section */}
      <Image
        source={require('../../assets/test_icon.png')} // Path to the icon
        style={styles.icon}
      />

      {/* Instructions */}
      <Text style={styles.title}>Welcome to the Dyslexia Test</Text>
      <Text style={styles.instructions}>
        This test will help us understand your learning needs better. Please follow the
        instructions carefully, and make sure you're in a quiet environment.
      </Text>

      {/* Start Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('DyslexiaTestInstructions')} // Navigate to the next page
      >
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>
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
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: '#3DB2FF', // Blue color for the title
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Bold', // Dyslexic-friendly font
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    color: '#6B7280', // Light gray for secondary text
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Regular', // Dyslexic-friendly font
    marginBottom: 40,
    lineHeight: 24,
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
  },
  startButtonText: {
    color: '#FFFFFF', // White text for the button
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold', // Dyslexic-friendly font
  },
});

export default DyslexiaTestStart;

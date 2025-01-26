import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

const HandWritingTestInstructions = ({ navigation }: any) => {
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Icon Section */}
      <Image
        source={require('../../../assets/Ilustration-Home Page.svg')} // Path to the icon
        style={styles.icon}
      />

      {/* Instructions */}
      <Text style={styles.title}>Handwriting Test Instructions</Text>
      <Text style={styles.instructions}>
        To perform this test:
        {'\n\n'}
        1. Sit in a quiet environment with proper lighting.
        {'\n'}
        2. Ensure you have a pen and paper ready.
        {'\n'}
        3. Write each word clearly and legibly.
      </Text>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('WritingTest')} // Navigate to the next page
      >
        <Text style={styles.startButtonText}>Continue</Text>
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
    backgroundColor: '#FFFFFF',
  },
  icon: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
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
    textAlign: 'left',
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

export default HandWritingTestInstructions;

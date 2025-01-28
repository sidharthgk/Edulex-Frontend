import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

const DictationTestInstructions = ({ navigation }: any) => {
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
    <View style={styles.container}>
      {/* Icon Section */}
      <Image
        source={require('../../../assets/images/eyetrack-model.png')} // Replace with your dictation icon
        style={styles.icon}
      />

      {/* Title */}
      <Text style={styles.title}>Dictation Test Instructions</Text>

      {/* Instructions */}
      <Text style={styles.instructions}>
        To perform this test:
        {'\n\n'}
        1. Ensure you are in a quiet place with minimal distractions.
        {'\n'}
        2. Tap the play button to hear a sentence.
        {'\n'}
        3. Type the exact sentence you hear in the provided text box.
        {'\n'}
        4. Press "Submit" when all sentences are complete.
      </Text>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('DictationTest')} // Navigate to the dictation test
      >
        <Text style={styles.startButtonText}>Start Test</Text>
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
    width: 400,
    height: 420,
    position: 'absolute',
    top: 10,
    left: 40,
  },
  title: {
    fontSize: 24,
    color: '#3DB2FF', // Blue color for the title
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Bold', // Dyslexic-friendly font
    marginBottom: 20,
    marginTop: 200,
  },
  instructions: {
    fontSize: 16,
    color: '#6B7280', // Light gray for secondary text
    textAlign: 'left',
    fontFamily: 'OpenDyslexic-Regular', // Dyslexic-friendly font
    marginBottom: 40,
    lineHeight: 24,
    width: '90%',
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

export default DictationTestInstructions;

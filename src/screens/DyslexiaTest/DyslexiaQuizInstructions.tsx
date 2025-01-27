import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

const DyslexiaQuizInstructions = ({ navigation }: any) => {
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
        source={require('../../../assets/images/quiz-model2.png')} // Replace with your quiz icon path
        style={styles.icon}
      />

      {/* Title */}
      <Text style={styles.title}>Quiz Test Instructions</Text>

      {/* Instructions */}
      <Text style={styles.instructions}>
        To perform this quiz:
        {'\n\n'}
        1. Find a quiet place free from distractions.
        {'\n'}
        2. Read each question carefully and select the best answer.
        {'\n'}
        3. Once you have completed all questions, click the Finish button.
      </Text>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('DyslexiaQuiz')} // Navigate to the quiz test
      >
        <Text style={styles.startButtonText}>Start Quiz</Text>
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
    width: 300,
    height: 340,
    marginTop: -50,
  },
  title: {
    fontSize: 24,
    color: '#3DB2FF', // Blue color for the title
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Bold', // Dyslexic-friendly font
    marginTop: -30,
  },
  instructions: {
    fontSize: 16,
    color: '#6B7280', // Light gray for secondary text
    textAlign: 'left',
    fontFamily: 'OpenDyslexic-Regular', // Dyslexic-friendly font
    marginBottom: 40,
    lineHeight: 24,
    width: '100%',
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

export default DyslexiaQuizInstructions;

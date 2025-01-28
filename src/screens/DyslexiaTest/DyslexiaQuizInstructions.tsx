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
      {/* Title */}
      <Text style={styles.title}>Quiz Test</Text>

      {/* Instruction Icon */}
      <Image
        source={require('../../../assets/images/quiz-model2.png')} // Replace with your quiz icon path
        style={styles.icon}
      />

      {/* Instruction Box */}
      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsText}>
          Please follow the instructions below:
        </Text>
        <Text style={styles.bulletPoint}>
          1. Find a quiet place free from distractions.
        </Text>
        <Text style={styles.bulletPoint}>
          2. Read each question carefully and select the best answer.
        </Text>
        <Text style={styles.bulletPoint}>
          3. Once you have completed all questions, click the Finish button.
        </Text>
      </View>

      {/* Start Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate('DyslexiaQuiz')} // Navigate to the quiz test
      >
        <Text style={styles.continueButtonText}>Start Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  icon: {
    width: 300,
    height: 290,
    marginTop: -40,
  },
  instructionsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#3DB2FF',
    width: '100%',
    marginBottom: 30,
    marginTop: -10,
  },
  instructionsText: {
    fontSize: 18,
    color: '#4B5563',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 10,
    lineHeight: 22,
  },
  continueButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default DyslexiaQuizInstructions;

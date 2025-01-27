import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useFonts } from 'expo-font';

const DyslexiaQuiz: React.FC<{ navigation: any }> = ({ navigation }) => {
  // Track quiz progress
  const [step, setStep] = useState<number>(0);

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading fonts...</Text>
      </View>
    );
  }

  // Example data for each step (placeholder content)
  const quizSteps = [
    {
      title: 'Picture Naming',
      description:
        'Look at the picture below and name what you see. This tests your ability to recall and name objects quickly.',
      image: require('../../../assets/images/writing_icon.png'), // Replace with your own image
      },
    {
      title: 'Word to Picture Matching',
      description:
        'Select the picture that matches the given word. This tests how well you can associate words with visual images.',
      image: require('../../../assets/images/writing_icon.png'), // Replace with your own image
    },
    {
      title: 'Rhyme Test',
      description:
        'Choose the word that rhymes with the provided word (e.g., “cat” -> “bat”).',
      image: null, // No image placeholder for this step
    },
    {
      title: 'Phoneme Replacement',
      description:
        'Replace the first letter of the word to form a new valid word (e.g., "cap" -> "_ap", answer: "map").',
      image: null,
    },
    {
      title: 'Semantic Fluency',
      description:
        'List as many words as you can within a category (e.g., animals) in the allotted time.',
      image: null,
    },
    {
      title: 'Verbal Fluency',
      description:
        'Generate words that begin with a given letter within a short time frame.',
      image: null,
    },
  ];

  const currentStep = quizSteps[step];

  const handleNext = () => {
    if (step < quizSteps.length - 1) {
      setStep(step + 1);
    } else {
      // Navigate to TestSubmitted screen with mediaType 'quiz'
      navigation.navigate('TestSubmitted', { mediaType: 'quiz' });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.quizContainer}>
        {/* Optional Icon/Image */}
        {currentStep.image && (
          <Image source={currentStep.image} style={styles.quizImage} />
        )}

        {/* Step Title */}
        <Text style={styles.title}>{currentStep.title}</Text>

        {/* Step Instructions/Description */}
        <Text style={styles.description}>{currentStep.description}</Text>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {step < quizSteps.length - 1 ? 'Next Test' : 'Finish'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DyslexiaQuiz;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Regular',
  },
  quizContainer: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#3DB2FF',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  quizImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
  },
});

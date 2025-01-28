import React, { useState, useContext } from 'react';
import { GlobalContext } from '../../GlobalState';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Speech from 'expo-speech';
import { useFonts } from 'expo-font';

const DictationTest = ({ navigation }: any) => {
  const [userInput, setUserInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const {state, setState} = useContext(GlobalContext);

  // The texts to dictate
  const dictationTexts = [
    // 'The quick brown fox jumps over the lazy dog',
    // 'A journey of a thousand miles begins with a single step',
    // 'All that glitters is not gold',
    'Actions speak louder than words',
    'Practice makes perfect',
  ];

  const currentText = dictationTexts[currentStep];

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  // Speak the current text
  const speak = () => {
    Speech.speak(currentText, { rate: 0.9 });
  };

  // Handle input changes
  const handleInputChange = (text: string) => {
    setUserInput(text);
    setIsButtonDisabled(text.trim().length === 0);
  };

  // Handle submission
  const handleSubmit = () => {
    const isCorrect =
      userInput.trim().toLowerCase() === currentText.toLowerCase();

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentStep < dictationTexts.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
      setUserInput('');
      setIsButtonDisabled(true);
    } else {
      // Capture final score including the last question
      const finalScore = score + (isCorrect ? 1 : 0);

      // Update global state with final score
      setState({...state, dictationScore: finalScore });

      // Log for debugging
      console.log('Final Score:', finalScore);

      // Pass finalScore in route params
      navigation.navigate('TestSubmitted', {
        mediaType: 'dictation',
        dictationScore: finalScore,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.quizContainer}>
          <Text style={styles.title}>Dictation Test</Text>
          <Text style={styles.description}>
            Tap the button below to hear the sentence. Type what you hear in the
            box provided.
          </Text>

          {/* Audio Button */}
          <TouchableOpacity style={styles.audioButton} onPress={speak}>
            <Text style={styles.audioButtonText}>🎵 Play Audio</Text>
          </TouchableOpacity>

          {/* Input Field */}
          <TextInput
            style={[styles.input]} // Fixed height
            placeholder="Type what you hear"
            placeholderTextColor="#888"
            value={userInput}
            onChangeText={handleInputChange}
            returnKeyType="done"
            accessible={true}
            accessibilityLabel="Answer input field"
            multiline={false} // Ensures single-line input
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isButtonDisabled}
          >
            <Text style={styles.buttonText}>
              {currentStep < dictationTexts.length - 1 ? 'Next' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  quizContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
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
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  audioButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  audioButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#3DB2FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
    color: '#333',
    textAlignVertical: 'center', // Keeps content vertically aligned
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
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A0CFFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default DictationTest;

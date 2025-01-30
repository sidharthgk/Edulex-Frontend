import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { GlobalContext } from '../../GlobalState';
import { useFonts } from 'expo-font';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  TestSubmitted: { mediaType: string; quizScore: number };
  Home: undefined;
};

type DyslexiaQuizProps = {
  navigation: StackNavigationProp<RootStackParamList, 'TestSubmitted'>;
};

type InputStep = {
  type: 'input';
  title: string;
  description: string;
  image?: any;
  question?: string;
  correctAnswers?: string[];
  correctAnswer?: string;
};

type MultipleChoiceStep = {
  type: 'multipleChoice';
  title: string;
  description: string;
  image?: any;
  question?: string;
  options?: string[];
  correctOption?: string;
};

type FillInTheBlankStep = {
  type: 'fillInTheBlank';
  title: string;
  description: string;
  question: string;
  correctAnswer: string;
  image?: any;
};

type QuizStep = InputStep | MultipleChoiceStep | FillInTheBlankStep;

const DyslexiaQuiz: React.FC<DyslexiaQuizProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  const [step, setStep] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const {state, setState} = useContext(GlobalContext);

  const quizSteps: QuizStep[] = [
    {
      type: 'input',
      title: 'Picture Naming',
      description: 'Look at the picture below and name what you see.',
      image: require('../../../assets/images/airplane.jpg'),
      correctAnswers: ['airplane', 'flight', 'plane'],
    },
    {
      type: 'multipleChoice',
      title: 'Word to Picture Matching',
      description: 'Select the option that matches the given word.',
      image: require('../../../assets/images/cat.jpg'),
      options: ['Cat', 'Dog', 'Bird'],
      correctOption: 'Cat',
    },
    {
      type: 'multipleChoice',
      title: 'Rhyme Test',
      description: 'Choose the word that rhymes with the provided word.',
      question: 'Choose a word that rhymes with "bat":',
      options: ['Doll', 'Mat', 'Bag'],
      correctOption: 'Mat',
    },
    {
      type: 'input',
      title: 'Phoneme Replacement',
      description: 'Replace the missing letter to form a correct word.',
      question: 'Complete the word: _ap',
      correctAnswers: ['cap', 'map', 'lap', 'tap', 'sap'],
    },
    {
      type: 'fillInTheBlank',
      title: 'Fill in the Blank',
      description: 'Complete the sentence by filling in the missing word.',
      question: 'The sky is ____.',
      correctAnswer: 'blue',
    },
    {
      type: 'multipleChoice',
      title: 'Synonym Selection',
      description: 'Select the word that is a synonym for the given word.',
      question: 'Choose a synonym for "happy":',
      options: ['Sad', 'Joyful', 'Angry'],
      correctOption: 'Joyful',
    },
  ];

  const currentStep: QuizStep = quizSteps[step];

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height / 3); // Reduced to one-third
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    if (currentStep.type === 'input' || currentStep.type === 'fillInTheBlank') {
      setIsButtonDisabled(userInput.trim().length === 0);
    } else if (currentStep.type === 'multipleChoice') {
      setIsButtonDisabled(selectedOption === null);
    }
  }, [userInput, selectedOption, currentStep]);

  useEffect(() => {
    setUserInput('');
    setSelectedOption(null);
  }, [step]);

  const handleInputSubmit = () => {
    if (currentStep.type === 'input') {
      const answer = userInput.trim().toLowerCase();
      const correct =
        currentStep.correctAnswers?.some(
          (ans) => ans.toLowerCase() === answer
        ) ||
        (currentStep.correctAnswer &&
          currentStep.correctAnswer.toLowerCase() === answer);

      if (correct) {
        setScore((prev) => prev + 1);
      }
      handleNext();
    } else if (currentStep.type === 'fillInTheBlank') {
      const answer = userInput.trim().toLowerCase();
      const correct = answer === currentStep.correctAnswer.toLowerCase();

      if (correct) {
        setScore((prev) => prev + 1);
      }
      handleNext();
    }
  };

  const handleMultipleChoiceSubmit = () => {
    if (currentStep.type === 'multipleChoice' && selectedOption) {
      const correct = selectedOption === currentStep.correctOption;
      if (correct) {
        setScore((prev) => prev + 1);
      }
      handleNext();
    }
  };

  const handleNext = () => {
    if (step < quizSteps.length - 1) {
      setStep((prevStep) => prevStep + 1);
    } else {
      navigation.navigate('TestSubmitted', { mediaType: 'quiz', quizScore: score });
      console.log(score);
      if (score) {
        setState({ ...state, quizScore: score });
      }
    }
  };

  const getContainerStyle = (kbHeight: number) =>
    StyleSheet.create({
      dynamicContainer: {
        marginBottom: kbHeight,
      },
    }).dynamicContainer;

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'input':
      case 'fillInTheBlank':
        return (
          <>
            {currentStep.image && (
              <Image source={currentStep.image} style={styles.quizImage} />
            )}
            {currentStep.question && (
              <Text style={styles.questionText}>{currentStep.question}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Type your answer here"
              value={userInput}
              onChangeText={setUserInput}
              onSubmitEditing={handleInputSubmit}
              returnKeyType="done"
              accessible={true}
              placeholderTextColor="#A9A9A9"
              accessibilityLabel="Answer input field"
            />
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={
                step < quizSteps.length - 1 ? 'Next question' : 'Finish quiz'
              }
              style={[
                styles.button,
                isButtonDisabled && styles.buttonDisabled,
              ]}
              onPress={handleInputSubmit}
              disabled={isButtonDisabled}
            >
              <Text style={styles.buttonText}>
                {step < quizSteps.length - 1 ? 'Next' : 'Finish'}
              </Text>
            </TouchableOpacity>
          </>
        );
      case 'multipleChoice':
        return (
          <>
            {currentStep.image && (
              <Image source={currentStep.image} style={styles.quizImage} />
            )}
            {currentStep.question && (
              <Text style={styles.questionText}>{currentStep.question}</Text>
            )}
            {currentStep.options &&
              currentStep.options.map((option: string) => (
                <TouchableOpacity
                  key={option}
                  accessible={true}
                  accessibilityLabel={`Option ${option}`}
                  style={[
                    styles.optionButton,
                    selectedOption === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleOptionSelect(option)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedOption === option && styles.optionButtonTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={
                step < quizSteps.length - 1 ? 'Next question' : 'Finish quiz'
              }
              style={[
                styles.button,
                isButtonDisabled && styles.buttonDisabled,
              ]}
              onPress={handleMultipleChoiceSubmit}
              disabled={isButtonDisabled}
            >
              <Text style={styles.buttonText}>
                {step < quizSteps.length - 1 ? 'Next' : 'Finish'}
              </Text>
            </TouchableOpacity>
          </>
        );
      default:
        return null;
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={[styles.quizContainer, getContainerStyle(keyboardHeight)]}>
          <Text style={styles.title}>{currentStep.title}</Text>
          <Text style={styles.description}>{currentStep.description}</Text>
          {renderStepContent()}
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
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
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
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  questionText: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#3DB2FF',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 20,
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
  optionButton: {
    width: '80%',
    borderWidth: 2,
    borderColor: '#3DB2FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 5,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#3DB2FF',
  },
  optionButtonText: {
    color: '#3DB2FF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default DyslexiaQuiz;

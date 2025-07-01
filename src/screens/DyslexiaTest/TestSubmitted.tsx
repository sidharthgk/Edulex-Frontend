import React, { useRef, useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
// import axios from 'axios';
import { GlobalContext } from '../../../src/GlobalState';
import authService from '../../services/authService';

const TestSubmitted = ({ navigation, route }: any) => {
  const { mediaType } = route.params;
  const [animationFinished, setAnimationFinished] = useState(false);
  const lottieRef = useRef<LottieView | null>(null);
  const textOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const { state, setState } = useContext(GlobalContext);
  const { photoUri, videoUri, dictationScore, quizScore } = state;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  useFocusEffect(
    React.useCallback(() => {
      setAnimationFinished(false);
      textOpacity.setValue(0);
      buttonOpacity.setValue(0);

      if (lottieRef.current) {
        lottieRef.current.reset();
        lottieRef.current.play();
      }
    }, [buttonOpacity, textOpacity])
  );

  useEffect(() => {
    if (animationFinished) {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          delay: 1000,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [animationFinished, textOpacity, buttonOpacity]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading fonts...</Text>
      </View>
    );
  }

  const handleNextTest = () => {
    if (mediaType === 'video') {
      navigation.navigate('WritingTest');
    } else if (mediaType === 'photo') {
      navigation.navigate('DictationTestInstructions');
    } else if (mediaType === 'dictation') {
      navigation.navigate('DyslexiaQuizInstructions');
    }
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);

    try {
      // Generate random scores for eye tracking and handwriting if not already set
      const updatedState = {
        ...state,
        eyeTrackingScore: state.eyeTrackingScore || Math.floor(Math.random() * 16),
        handwritingScore: state.handwritingScore || Math.floor(Math.random() * 16),
        phoneticsProbability: state.phoneticsProbability || Math.floor(Math.random() * 16),
      };

      // Update GlobalState with the generated scores
      setState(updatedState);

      // Format and submit test results to API
      const formattedResults = authService.formatTestResults(updatedState);

      console.log('📊 Submitting final test results:', formattedResults);

      if (formattedResults.length > 0) {
        await authService.submitDyslexiaResults({ results: formattedResults });
        console.log('✅ Results submitted successfully to API');
      } else {
        console.warn('⚠️ No test results to submit');
      }

      // Navigate to results regardless of API success/failure
      navigation.navigate('TestResult');
    } catch (error: any) {
      console.error('❌ Failed to submit results to API:', error);

      // Show error alert but still navigate to results
      Alert.alert(
        'Submission Notice',
        'Your test results have been processed locally. Some data may not have been saved to the server, but you can still view your results.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('TestResult'),
          },
        ],
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  let successText = '';
  let animationSource: any = require('../../../assets/success.json');
  let buttonText = '';

  switch (mediaType) {
    case 'video':
      successText = 'Your video has been submitted!';
      buttonText = 'Next Test';
      break;
    case 'photo':
      successText = 'Your photo has been submitted!';
      buttonText = 'Next Test';
      break;
    case 'dictation':
      successText = 'Your response has been submitted!';
      buttonText = 'Next Test';
      break;
    case 'quiz':
      successText = 'Your quiz has been submitted!';
      buttonText = isSubmitting ? 'Submitting Results...' : 'View Results';
      console.log('Final output:', videoUri, photoUri, dictationScore, quizScore);
      break;
    default:
      successText = 'Submission successful!';
      break;
  }

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          ref={lottieRef}
          source={animationSource}
          autoPlay
          loop={false}
          style={styles.lottieAnimation}
          onAnimationFinish={() => setAnimationFinished(true)}
        />
      </View>

      <View style={styles.contentContainer}>
        <Animated.Text style={[styles.successText, { opacity: textOpacity }]}>
          {successText}
        </Animated.Text>
        <Animated.View style={{ opacity: buttonOpacity }}>
          {mediaType === 'quiz' && isSubmitting ? (
            // Moved 10 px down by adding marginTop
            <ActivityIndicator
              size="large"
              color="#3DB2FF"
              style={styles.loader}
            />
          ) : (
            <TouchableOpacity
              style={[
                styles.nextButton,
                isSubmitting && styles.nextButtonDisabled,
              ]}
              onPress={mediaType === 'quiz' ? handleFinalSubmit : handleNextTest}
              disabled={isSubmitting}
            >
              <Text style={styles.nextButtonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

export default TestSubmitted;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  animationContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 250,
    height: 250,
  },
  contentContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    fontSize: 22,
    marginTop: -300,
    marginHorizontal: 10,
    marginBottom: 40,
    textAlign: 'center',
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  nextButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    margin: 10,
  },
  loader: {
    transform: [{ scale: 2 }],
    marginTop: 10 },
  nextButtonDisabled: {
    backgroundColor: '#B0BEC5',
    opacity: 0.6,
  },
});

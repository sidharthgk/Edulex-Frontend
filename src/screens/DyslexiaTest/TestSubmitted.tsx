import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { GlobalContext } from '../../../src/GlobalState';

const TestSubmitted = ({ navigation, route }: any) => {
  // Extract the mediaType param
  const { mediaType } = route.params;

  // State that determines if the Lottie animation has finished
  const [animationFinished, setAnimationFinished] = useState(false);

  // Refs for Lottie and Animated values
  const lottieRef = useRef<LottieView | null>(null);
  const textOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  // Destructure state from the global context
  const { state } = useContext(GlobalContext);
  // Pull out the specific properties from state
  const { photoUri, videoUri, dictationScore, quizScore } = state;

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  // Reset animation and states whenever this screen is focused
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

  // Fade in text & button after Lottie animation finishes
  useEffect(() => {
    if (animationFinished) {
      // Fade in the text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Fade in the button after the text
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          delay: 1000,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [animationFinished, textOpacity, buttonOpacity]);

  // Return early if fonts are not loaded yet
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading fonts...</Text>
      </View>
    );
  }

  // Function to handle navigation to the next test
  const handleNextTest = () => {
    if (mediaType === 'video') {
      navigation.navigate('WritingTest');
    } else if (mediaType === 'photo') {
      navigation.navigate('DictationTest');
    } else if (mediaType === 'dictation') {
      navigation.navigate('DyslexiaQuiz');
    }
  };

  // Function to handle final submission
  const handleFinalSubmit = async () => {
    try {
      const response = await axios.post('YOUR_API_ENDPOINT', {
        videoUri,
        photoUri,
        dictationScore,
        quizScore,
      });
      console.log('API response:', response.data);
      // Navigate to the next screen or show a success message
    } catch (error) {
      console.error('API call error:', error);
    }
  };

  // Conditional text and animation based on mediaType
  let successText = '';
  let animationSource: any = require('../../../assets/success.json'); // Default animation
  let buttonText = '';

  switch (mediaType) {
    case 'video':
      successText = 'Your video has been submitted!';
      buttonText = 'Proceed to next test';
      break;
    case 'photo':
      successText = 'Your photo has been submitted!';
      buttonText = 'Proceed to next test';
      break;
    case 'dictation':
      successText = 'Your response has been submitted!';
      buttonText = 'Proceed to next test';
      break;
    case 'quiz':
      successText = 'Your quiz has been submitted!';
      buttonText = 'Final Submit';
      console.log('Final output:', videoUri, photoUri, dictationScore, quizScore);
      break;
    default:
      successText = 'Submission successful!';
      break;
  }

  return (
    <View style={styles.container}>
      {/* Animation Container */}
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

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Animated Text */}
        <Animated.Text style={[styles.successText, { opacity: textOpacity }]}>
          {successText}
        </Animated.Text>

        {/* Animated Button */}
        <Animated.View style={{ opacity: buttonOpacity }}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={mediaType === 'quiz' ? handleFinalSubmit : handleNextTest}
          >
            <Text style={styles.nextButtonText}>{buttonText}</Text>
          </TouchableOpacity>
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
    fontSize: 17,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
});

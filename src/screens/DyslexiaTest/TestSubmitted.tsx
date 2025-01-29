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
  const { mediaType } = route.params;
  const [animationFinished, setAnimationFinished] = useState(false);
  const lottieRef = useRef<LottieView | null>(null);
  const textOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const { state } = useContext(GlobalContext);
  const { photoUri, videoUri, dictationScore, quizScore } = state;

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
      navigation.navigate('DictationTest');
    } else if (mediaType === 'dictation') {
      navigation.navigate('DyslexiaQuiz');
    }
  };

  // Example function to handle final submission to /detect/ endpoint
  const handleFinalSubmit = async () => {
    try {
      // Construct a FormData object for multipart/form-data
      const formData = new FormData();
      formData.append('user_id', 1); // Replace with actual user ID
      // Convert the video URI to a form data field if available
      if (videoUri) {
        formData.append('video', {
          uri: videoUri,
          // Provide the appropriate MIME type and file name
          type: 'video/mov',
          name: 'video.mov',
        });
      }
      // Convert the photo URI to a form data field if available
      if (photoUri) {
        formData.append('handwriting_image', {
          uri: photoUri,
          type: 'image/jpeg',
          name: 'handwriting.jpg',
        });
      }
      // The text for phonetics
      formData.append('phonetics_text', 'Sample phonetics text');

      // Example Axios POST request to /detect/ (replace with your actual API base)
      const response = await axios.post('https://detection.albinvar.in/detect/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      console.log('Detection API response:', response.data);
      // Handle the detection results or navigate to another screen
    } catch (error) {
      console.error('API call error:', error);
    }
  navigation.navigate('TestResult');
  };

  let successText = '';
  let animationSource: any = require('../../../assets/success.json');
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
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    margin:10,
  },
});

import React, { useRef, useState, useEffect } from 'react';
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

const EyeTrackingTestSubmitted = ({ navigation }: any) => {
  // State that determines if the Lottie animation has finished
  const [animationFinished, setAnimationFinished] = useState(false);

  // Refs for Lottie and Animated values
  const lottieRef = useRef<LottieView | null>(null);
  const textOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  // Reset animation and states whenever this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // 1. Reset state so that fade-in can happen again
      setAnimationFinished(false);

      // 2. Reset Animated values for text/button
      textOpacity.setValue(0);
      buttonOpacity.setValue(0);

      // 3. Reset and replay the Lottie animation
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
        // Once text is visible, fade in the button (with a short delay)
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

  return (
    <View style={styles.container}>
      {/* Animation Container */}
      <View style={styles.animationContainer}>
        <LottieView
          ref={lottieRef}
          source={require('../../../assets/success.json')}
          autoPlay
          loop={false}
          style={styles.lottieAnimation}
          onAnimationFinish={() => setAnimationFinished(true)}
        />
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Animated Text */}
        <Animated.Text
          style={[
            styles.successText,
            { opacity: textOpacity },
          ]}
        >
          Your video has been submitted!
        </Animated.Text>

        {/* Animated Button */}
        <Animated.View style={{ opacity: buttonOpacity }}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.navigate('HandWritingTestInstructions')}
          >
            <Text style={styles.nextButtonText}>
              Proceed to next test
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default EyeTrackingTestSubmitted;

const styles = StyleSheet.create({
  // Overall screen container
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Loading screen
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Regular',
  },

  // Animation container (e.g., ~60% of the screen)
  animationContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 250,
    height: 250,
  },

  // Content container (e.g., ~40% of the screen)
  contentContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Success text
  successText: {
    fontSize: 22,
    marginTop: -300,
    marginHorizontal: 10,
    marginBottom: 40,
    textAlign: 'center',
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
  },

  // Next button styling
  nextButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  nextButtonText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
});

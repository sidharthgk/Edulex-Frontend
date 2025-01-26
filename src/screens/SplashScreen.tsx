import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import SvgImage from '../../assets/Splash.svg';

const SplashScreen = ({ navigation }: any) => {
  // Create a fade animation using the Animated API
  const fadeAnim = useRef(new Animated.Value(0)).current;

  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    // Fade in the logo and title
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Navigate to StarterScreen after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('StarterScreen');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, fontsLoaded, fadeAnim]);

  // If fonts are not loaded, display nothing (or a fallback)
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Animated View wraps our content for smooth fade-in */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <SvgImage style={styles.logo} height={300} width={400} />
        <Text style={styles.title}>EDULEX AI</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Main container covers the entire screen
    flex: 1,
    backgroundColor: '#3DB2FF', // Keep the same blue background
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    // Content container for our SVG and text
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    // Adjust the logo size and positioning
    width: 200,
    height: 200,
    marginBottom: 20,
    marginLeft: -30, // Move it slightly to the left, as in original design
  },
  title: {
    // Dyslexia-friendly font
    fontSize: 36,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default SplashScreen;

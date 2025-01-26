import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import SvgImage from '../assets/Logo-Splash.svg';

const SplashScreen = ({ navigation }: any) => {
  let [fontsLoaded] = useFonts({
      'OpenDyslexic-Regular': require('../assets/fonts/OpenDyslexic-Regular.otf'),
      'OpenDyslexic-Bold': require('../assets/fonts/OpenDyslexic-Bold.otf'),
      'OpenDyslexic-Italic': require('../assets/fonts/OpenDyslexic-Italic.otf'),
    });

  useEffect(() => {
  if (!fontsLoaded) {
    return;
  }
  // Navigate to Starter Screen after 2 seconds
  const timer = setTimeout(() => {
    navigation.replace('StarterScreen');
  }, 2000);
  return () => clearTimeout(timer); // Cleanup timer
  }, [navigation, fontsLoaded]);

  if (!fontsLoaded) {
  return null;
  }

  return (
  <View style={styles.container}>
    <View>
      <SvgImage style={styles.logo} />
    </View>
    <Text style={styles.title}>EDULEX AI</Text>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#3DB2FF', // Blue background
  },
  logo: {
  width: 200, // Increased width
  height: 200, // Increased height
  marginBottom: 20,
  marginLeft: -30, // Move to the left
  },
  title: {
  fontSize: 35,
  color: '#fff',
  fontFamily: 'OpenDyslexic-Bold',
  },
});

export default SplashScreen;

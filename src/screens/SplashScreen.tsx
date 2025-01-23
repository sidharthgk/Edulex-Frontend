import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

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
    <Image
    source={require('../assets/logo.png')} // Add logo to assets folder
    style={styles.logo}
    />
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

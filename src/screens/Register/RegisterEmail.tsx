import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFonts } from 'expo-font';

const RegisterEmail = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleNext = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      navigation.navigate('RegisterPassword');
    } else {
      setIsValidEmail(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../../assets/backbutton.png')} style={styles.backButtonImage} />
      </TouchableOpacity>
      <Text style={styles.title}>What is your email?</Text>
      <TextInput
        style={[styles.input, !isValidEmail && styles.invalidInput]}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setIsValidEmail(true);
        }}
        placeholder="Enter your email"
        placeholderTextColor="#888" // Updated placeholder color
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {!isValidEmail && <Text style={styles.errorText}>Please enter a valid email address.</Text>}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60, // Positioned slightly below the top
    left: 20,
  },
  backButtonImage: {
    width: 80, // Keep original size
    height: 80,
    marginLeft: -20, // Maintain alignment
  },
  title: {
    fontSize: 20,
    color: '#3DB2FF', // Updated color to match theme
    fontFamily: 'OpenDyslexic-Bold', // Updated font family
    marginBottom: 20,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#3DB2FF', // Updated border color
    borderRadius: 50, // Updated input radius
    width: '80%',
    padding: 15, // Increased padding for better usability
    marginBottom: 10,
    color: '#333', // Darker text for input
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular', // Updated font family
  },
  invalidInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    fontFamily: 'OpenDyslexic-Regular', // Updated font family
  },
  nextButton: {
    backgroundColor: '#3DB2FF', // Updated button background color
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 50, // Updated button radius
  },
  nextButtonText: {
    color: '#FFFFFF', // White text for button
    fontFamily: 'OpenDyslexic-Bold', // Updated font family
    fontSize: 14,
  },
});

export default RegisterEmail;

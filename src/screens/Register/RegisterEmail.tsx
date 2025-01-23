import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

const RegisterEmail = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  let [fontsLoaded] = useFonts({
      'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
      'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
      'OpenDyslexic-itallic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
    });
    if (!fontsLoaded) {
      return null;
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
      <Text style={styles.title}>What is your email?</Text>
      <TextInput
        style={[styles.input, !isValidEmail && styles.invalidInput]}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setIsValidEmail(true);
        }}
        placeholder="Enter your email"
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007BFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 8,
    width: '80%',
    padding: 12,
    marginBottom: 10,
  },
  invalidInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default RegisterEmail;

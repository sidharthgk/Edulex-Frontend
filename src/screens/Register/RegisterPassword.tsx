import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFonts } from 'expo-font';

const RegisterPassword = ({ navigation }: any) => {
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handlePasswordChange = (text: string) => {
    setPassword(text);

    // Simple password strength logic
    if (text.length < 6) {
      setPasswordStrength('Weak');
    } else if (text.length < 10) {
      setPasswordStrength('Moderate');
    } else {
      setPasswordStrength('Strong');
    }
  };

  const handleRegisterComplete = () => {
    // Reset navigation stack to start from DyslexiaTestStart
    navigation.reset({
      index: 0,
      routes: [{ name: 'DyslexiaTestStart' }],
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/backbutton.png')} style={styles.backButtonImage} />
      </TouchableOpacity>
      <Text style={styles.title}>Enter your password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={handlePasswordChange}
        placeholder="Enter your password"
        placeholderTextColor="#888"
        secureTextEntry
      />
      {password.length > 0 && (
        <Text
          style={[
            styles.passwordStrength,
            styles[passwordStrength.toLowerCase() as PasswordStrength],
          ]}
        >
          Password Strength: {passwordStrength}
        </Text>
      )}
      <TouchableOpacity style={styles.nextButton} onPress={handleRegisterComplete}>
        <Text style={styles.nextButtonText}>Start Dyslexia Test</Text>
      </TouchableOpacity>
    </View>
  );
};

type PasswordStrength = 'weak' | 'moderate' | 'strong';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
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
    padding: 15,
    marginBottom: 10,
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 14,
    color: '#333',
  },
  passwordStrength: {
    fontSize: 14,
    marginBottom: 20,
    fontFamily: 'OpenDyslexic-Regular',
  },
  weak: {
    color: 'red',
  },
  moderate: {
    color: '#E0A800', // Yellow
  },

  strong: {
    color: 'green',
  },
  nextButton: {
    backgroundColor: '#3DB2FF', // Updated button background color
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 50, // Updated button radius
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold', // Updated font family
    fontSize: 14,
  },
});

export default RegisterPassword;

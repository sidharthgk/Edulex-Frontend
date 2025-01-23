import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const RegisterPassword = ({ navigation }: any) => {
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

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
      index: 0, // Make DyslexiaTestStart the first screen
      routes: [{ name: 'DyslexiaTestStart' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set up your password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={handlePasswordChange}
        placeholder="Enter your password"
        secureTextEntry
      />
      {password.length > 0 && (
        <Text style={[styles.passwordStrength, styles[passwordStrength.toLowerCase() as PasswordStrength]]}>
          Password Strength: {passwordStrength}
        </Text>
      )}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleRegisterComplete}
      >
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
  passwordStrength: {
    fontSize: 14,
    marginBottom: 20,
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

export default RegisterPassword;

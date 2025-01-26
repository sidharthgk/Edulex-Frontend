import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useFonts } from 'expo-font';

// Define PasswordStrength as a union type
type PasswordStrength = 'weak' | 'moderate' | 'strong';

const RegisterPassword = ({ navigation }: any) => {
  const [password, setPassword] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | ''>('');

  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Determines the strength of the entered password
  const handlePasswordChange = (text: string) => {
    setPassword(text);

    // Simple password strength logic
    if (text.length === 0) {
      setPasswordStrength('');
    } else if (text.length < 6) {
      setPasswordStrength('weak');
    } else if (text.length < 10) {
      setPasswordStrength('moderate');
    } else {
      setPasswordStrength('strong');
    }
  };

  // Handles the completion of registration
  const handleRegisterComplete = () => {
    // Reset navigation stack to start from DyslexiaTestStart
    navigation.reset({
      index: 0,
      routes: [{ name: 'DyslexiaTestStart' }],
    });
  };

  return (
    // Adjusts the view when the keyboard appears
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60} // Adjust based on your layout
    >
      {/* Allows the content to be scrollable if necessary */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../../assets/backbutton.png')}
            style={styles.backButtonImage}
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Enter your password</Text>

        {/* Password Input Field */}
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={handlePasswordChange}
          placeholder="Enter your password"
          placeholderTextColor="#888"
          secureTextEntry
        />

        {/* Password Strength Indicator */}
        {passwordStrength !== '' && (
          <Text
            style={[
              styles.passwordStrength,
              styles[passwordStrength], // Applies color based on strength
            ]}
          >
            Password Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
          </Text>
        )}

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleRegisterComplete}>
          <Text style={styles.nextButtonText}>Start Dyslexia Test</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1, // Ensures content can scroll if necessary
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    position: 'absolute',
    top: 60, // Positioned slightly below the top
    left: 20,
  },
  backButtonImage: {
    width: 80, // Maintain original size
    height: 80,
    marginLeft: -20, // Maintain alignment
  },
  title: {
    fontSize: 20,
    color: '#3DB2FF', // Matches theme color
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 20,
  },  input: {
    borderWidth: 1.5,
    borderColor: '#3DB2FF', // Matches theme color
    borderRadius: 50,
    width: '80%',
    padding: 15,
    marginBottom: 20,
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 14,
    color: '#333', // Darker text for better readability
  },
  nextButton: {
    backgroundColor: '#3DB2FF', // Button matches theme color
    paddingVertical: 12,
    paddingHorizontal: 27,
    borderRadius: 50,
    marginBottom: 60,
  },
  passwordStrength: {
    fontSize: 14,
    marginBottom: 20,
    fontFamily: 'OpenDyslexic-Regular',
  },
  weak: {
    color: 'red', // Indicates weak password
  },
  moderate: {
    color: '#E0A800', // Indicates moderate password (yellow)
  },
  strong: {
    color: 'green', // Indicates strong password
  },
  nextButtonText: {
    color: '#FFFFFF', // White text stands out on the button
    fontFamily: 'OpenDyslexic-Bold',
    fontSize: 14,
  },
});

export default RegisterPassword;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { useFonts } from 'expo-font';

const RegisterScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(0); // Track current step
  const [formData, setFormData] = useState<Record<string, string>>({
    age: '',
    name: '',
    email: '',
    password: '',
  });

  const steps = [
    {
      label: 'What is your name?',
      placeholder: 'Enter your name',
      keyboardType: 'default' as const,
      field: 'name',
    },
    {
      label: 'How old are you?',
      placeholder: 'Enter your age',
      keyboardType: 'numeric' as const,
      field: 'age',
    },
    {
      label: 'What is your email?',
      placeholder: 'Enter your email',
      keyboardType: 'email-address' as const,
      field: 'email',
    },
    {
      label: 'Enter your password',
      placeholder: 'Enter your password',
      keyboardType: 'default' as const,
      field: 'password',
      secureTextEntry: true,
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
      Keyboard.dismiss();
    } else {
      // Finalize Registration
      navigation.reset({
        index: 0,
        routes: [{ name: 'DyslexiaTestStart' }], // Adjust destination if needed
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleInputChange = (value: string) => {
    setFormData((prev) => ({ ...prev, [currentStep.field]: value }));
  };

  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const isNextButtonDisabled = !formData[currentStep.field]?.trim();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Step Label */}
          <Text style={styles.label}>{currentStep.label}</Text>

          {/* Input Field */}
          <TextInput
            style={styles.input}
            placeholder={currentStep.placeholder}
            placeholderTextColor="#888"
            keyboardType={currentStep.keyboardType}
            secureTextEntry={currentStep.secureTextEntry || false}
            value={formData[currentStep.field]}
            onChangeText={handleInputChange}
          />

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextButton, isNextButtonDisabled && styles.disabledButton]}
              onPress={handleNext}
              disabled={isNextButtonDisabled}
            >
              <Text
                style={[
                  styles.nextButtonText,
                  isNextButtonDisabled && styles.disabledButtonText,
                ]}
              >
                {step < steps.length - 1 ? 'Next' : 'Finish'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    marginTop: 20, // Ensure content is visible
  },
  label: {
    fontSize: 20,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#3DB2FF',
    borderRadius: 50,
    padding: 15,
    marginBottom: 20,
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20, // Add margin to separate buttons from the input
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#3DB2FF',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 0.45,
    alignItems: 'center',
  },
  backButtonText: {
    fontFamily: 'OpenDyslexic-Bold',
    fontSize: 14,
    color: '#3DB2FF',
  },
  nextButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 0.45,
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: 'OpenDyslexic-Bold',
    fontSize: 14,
    color: '#FFFFFF', // Set text color to white
  },
  disabledButton: {
    backgroundColor: '#D3D3D3', // Make the disabled button visible
    borderColor: '#A0A0A0',
  },
  disabledButtonText: {
    color: '#A0A0A0', // Make the text on disabled button distinguishable
  },
});

export default RegisterScreen;

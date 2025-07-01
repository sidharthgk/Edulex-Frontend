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
  ActivityIndicator,
} from 'react-native';
import { useFonts } from 'expo-font';
import { useAuth } from '../context/AuthContext';
import ToastNotification from '../components/ToastNotification';
import { useToast } from '../hooks/useToast';

const RegisterScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(0); // Track current step
  const [formData, setFormData] = useState<Record<string, string>>({
    name: '',
    age: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  
  // Authentication context
  const { register, isLoading } = useAuth();
  
  // Toast notifications
  const { toast, showSuccess, showError, hideToast } = useToast();

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
      label: 'Create a password',
      placeholder: 'Enter your password',
      keyboardType: 'default' as const,
      field: 'password',
      secureTextEntry: true,
    },
    {
      label: 'Confirm your password',
      placeholder: 'Re-enter your password',
      keyboardType: 'default' as const,
      field: 'password_confirmation',
      secureTextEntry: true,
    },
  ];

  const currentStep = steps[step];

  const validateCurrentStep = () => {
    const value = formData[currentStep.field]?.trim();
    
    if (!value) {
      showError(`Please enter your ${currentStep.field.replace('_', ' ')}`);
      return false;
    }
    
    // Validate email format
    if (currentStep.field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError('Please enter a valid email address');
        return false;
      }
    }
    
    // Validate password length
    if (currentStep.field === 'password') {
      if (value.length < 8) {
        showError('Password must be at least 8 characters long');
        return false;
      }
    }
    
    // Validate password confirmation
    if (currentStep.field === 'password_confirmation') {
      if (value !== formData.password) {
        showError('Passwords do not match');
        return false;
      }
    }
    
    // Validate age
    if (currentStep.field === 'age') {
      const age = parseInt(value);
      if (isNaN(age) || age < 5 || age > 100) {
        showError('Please enter a valid age between 5 and 100');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
      Keyboard.dismiss();
    } else {
      Keyboard.dismiss();
      await handleRegistration();
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

  const handleRegistration = async () => {
    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
      
      if (result.success) {
        showSuccess('Account created successfully! 🎉');
        // Navigate to assessment after successful registration
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'DyslexiaTestStart' }],
          });
        }, 1500);
      } else {
        showError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error types with user-friendly messages
      if (error.type === 'VALIDATION_ERROR') {
        const message = error.message || 'Please check your input and try again.';
        showError(`⚠️ ${message}`);
      } else if (error.type === 'NETWORK_ERROR') {
        showError('🌐 Network error. Please check your internet connection and try again.');
      } else if (error.type === 'SERVER_ERROR') {
        showError('🔧 Server maintenance in progress. Please try again later.');
      } else if (error.type === 'RATE_LIMIT') {
        showError('⏰ Too many registration attempts. Please wait a moment before trying again.');
      } else {
        const message = error.message || 'An unexpected error occurred. Please try again.';
        showError(message);
      }
    }
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
          <Text style={styles.label}>{currentStep.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={currentStep.placeholder}
            placeholderTextColor="#888"
            keyboardType={currentStep.keyboardType}
            secureTextEntry={currentStep.secureTextEntry || false}
            textContentType={currentStep.field === 'password' ? 'password' : 'none'} // Ensure correct text type
            autoCorrect={false} // Disable auto-correction
            autoCapitalize="none" // Prevent auto-capitalization
            value={formData[currentStep.field]}
            onChangeText={handleInputChange}
          />
          {/* handwriting test fix + register start page */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextButton, (isNextButtonDisabled || isLoading) && styles.disabledButton]}
              onPress={handleNext}
              disabled={isNextButtonDisabled || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text
                  style={[
                    styles.nextButtonText,
                    isNextButtonDisabled && styles.disabledButtonText,
                  ]}
                >
                  {step < steps.length - 1 ? 'Next' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Toast Notification */}
        <ToastNotification
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={hideToast}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', paddingHorizontal: 20 },
  content: { alignItems: 'center', marginTop: 20 },
  label: { fontSize: 20, color: '#3DB2FF', fontFamily: 'OpenDyslexic-Bold', marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', borderWidth: 1.5, borderColor: '#3DB2FF', borderRadius: 50, padding: 15, marginBottom: 20, fontFamily: 'OpenDyslexic-Regular', fontSize: 14, color: '#333' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
  backButton: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#3DB2FF', borderRadius: 50, paddingVertical: 12, paddingHorizontal: 20, flex: 0.45, alignItems: 'center' },
  backButtonText: { fontFamily: 'OpenDyslexic-Bold', fontSize: 14, color: '#3DB2FF' },
  nextButton: { backgroundColor: '#3DB2FF', borderRadius: 50, paddingVertical: 12, paddingHorizontal: 20, flex: 0.45, alignItems: 'center' },
  nextButtonText: { fontFamily: 'OpenDyslexic-Bold', fontSize: 14, color: '#FFFFFF' },
  disabledButton: { backgroundColor: '#D3D3D3' },
  disabledButtonText: { color: '#A0A0A0' },
});

export default RegisterScreen;

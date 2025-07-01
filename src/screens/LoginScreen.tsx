import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import SvgImage from '../../assets/Splash.svg';
import { useAuth } from '../context/AuthContext';
import DyslexicAlert from '../components/DyslexicAlert';
import ToastNotification from '../components/ToastNotification';
import { useToast } from '../hooks/useToast';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPasswordAlert, setShowForgotPasswordAlert] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  // Authentication context
  const { login, isLoading, sendPasswordResetLink } = useAuth();
  
  // Toast notifications
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Login handler with API integration
  const handleLogin = async () => {
    if (!email.trim()) {
      showError('Please enter your email address');
      return;
    }
    
    if (!password.trim()) {
      showError('Please enter your password');
      return;
    }

    try {
      const result = await login({ email: email.trim(), password });
      
      if (result.success) {
        showSuccess('Welcome back! 🎉');
        // Navigation will be handled by the AuthContext/AppNavigator
        navigation.navigate('TabNavigator');
      } else {
        showError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error types with user-friendly messages
      if (error.type === 'UNAUTHORIZED') {
        showError('❌ Invalid email or password. Please check your credentials and try again.');
      } else if (error.type === 'VALIDATION_ERROR') {
        // Show the specific validation error message from the API
        const message = error.message || 'Please check your input and try again.';
        showError(`⚠️ ${message}`);
      } else if (error.type === 'RATE_LIMIT') {
        showError('⏰ Too many login attempts. Please wait a moment before trying again.');
      } else if (error.type === 'NETWORK_ERROR') {
        showError('🌐 Network error. Please check your internet connection and try again.');
      } else if (error.type === 'SERVER_ERROR') {
        showError('🔧 Server maintenance in progress. Please try again later.');
      } else {
        // Fallback for any other errors
        const message = error.message || 'An unexpected error occurred. Please try again.';
        showError(message);
      }
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    setResetEmail(email); // Pre-fill with current email if entered
    setShowForgotPasswordAlert(true);
  };

  const handleSendResetLink = async () => {
    if (!resetEmail.trim()) {
      showError('Please enter your email address');
      return;
    }

    try {
      const result = await sendPasswordResetLink(resetEmail.trim());
      
      if (result.success) {
        showSuccess('Password reset link sent to your email! 📧');
        setShowForgotPasswordAlert(false);
        setResetEmail('');
      } else {
        showError(result.message || 'Failed to send reset link');
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Handle specific error types for password reset
      if (error.type === 'VALIDATION_ERROR') {
        const message = error.message || 'Please enter a valid email address.';
        showError(`⚠️ ${message}`);
      } else if (error.type === 'NETWORK_ERROR') {
        showError('🌐 Network error. Please check your internet connection and try again.');
      } else if (error.type === 'SERVER_ERROR') {
        showError('🔧 Server error. Please try again later.');
      } else if (error.type === 'RATE_LIMIT') {
        showError('⏰ Too many requests. Please wait a moment before trying again.');
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo and Welcome Section */}
          <View style={styles.topContainer}>
            <SvgImage height={150} width={150} style={styles.logo} />
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Login to access your account and continue learning.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
              />
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Standard Login Button */}
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* or sign up with */}
            <Text style={styles.orText}>or sign up with</Text>
            <View style={styles.socialContainer}>
              {/* Google Icon */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => console.log('Sign up with Google')}
              >
                <Ionicons name="logo-google" size={28} color="#DD4B39" />
              </TouchableOpacity>

              {/* Facebook Icon */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => console.log('Sign up with Facebook')}
              >
                <Ionicons name="logo-facebook" size={28} color="#4267B2" />
              </TouchableOpacity>

              {/* Twitter Icon */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => console.log('Sign up with Twitter')}
              >
                <Ionicons name="logo-twitter" size={28} color="#1DA1F2" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('RegisterStart')}
            >
              <Text style={styles.registerText}>
                Don’t have an account?{' '}
                <Text style={styles.registerHighlight}>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        {/* Forgot Password Alert */}
        <DyslexicAlert
          visible={showForgotPasswordAlert}
          title="🔐 Reset Password"
          message="Enter your email address and we'll send you a link to reset your password."
          type="info"
          onConfirm={handleSendResetLink}
          onCancel={() => setShowForgotPasswordAlert(false)}
          confirmText="Send Link"
          cancelText="Cancel"
          showCancel={true}
        />
        
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
  container: {
    flex: 1,
    backgroundColor: '#3DB2FF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  topContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  logo: {
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  inputWrapper: {
    width: '100%',
    marginVertical: 10,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    fontSize: 14,
    color: '#333',
    fontFamily: 'OpenDyslexic-Regular',
  },
  button: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 15,
    color: '#888',
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconButton: {
    marginHorizontal: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F1F1',
  },
  registerText: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
    marginTop: 15,
    textAlign: 'center',
  },
  registerHighlight: {
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 5,
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#3DB2FF',
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
  },
  buttonDisabled: {
    backgroundColor: '#A5D6FF',
    opacity: 0.6,
  },
});

export default LoginScreen;

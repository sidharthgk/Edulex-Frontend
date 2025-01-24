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
} from 'react-native';
import { useFonts } from 'expo-font';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Email:', email, 'Password:', password);
    // Implement authentication logic here
  };

  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>
          Login to access your account and continue learning.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Login with Google')}>
          <Text style={styles.linkText}>Login with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('RegisterStart')}>
          <Text style={styles.registerText}>Don’t have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3DB2FF',
  },
  topContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
    marginLeft: -15,
  },
  title: {
    fontSize: 26,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '90%',
    padding: 15,
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: '#3DB2FF',
    borderRadius: 50,
    fontSize: 14,
    color: '#333',
    fontFamily: 'OpenDyslexic-Regular',
  },
  button: {
    backgroundColor: '#3DB2FF',
    padding: 15,
    borderRadius: 50,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Bold',
  },
  linkText: {
    color: '#3DB2FF',
    fontSize: 13,
    marginTop: 10,
    fontFamily: 'OpenDyslexic-Regular',
  },
  registerText: {
    color: '#3DB2FF',
    fontSize: 13,
    marginTop: 10,
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default LoginScreen;

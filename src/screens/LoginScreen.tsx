import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
        'OpenDyslexic-itallic': require('../assets/fonts/OpenDyslexic-Italic.otf'),
      });
      if (!fontsLoaded) {
        return null;
      }

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to access your account and continue learning.</Text>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#888" // Adjust placeholder color
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#888" // Adjust placeholder color
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A94D6', // Match darker blue color
  },
  topContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#2A94D6', // Blue top background
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White bottom background
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '90%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: '#2A94D6',
    borderRadius: 50,
    fontSize: 16,
    color: '#333',
    fontFamily: 'OpenDyslexic-Regular', // Ensures Open Dyslexic font is applied
  },
  button: {
    backgroundColor: '#2A94D6',
    padding: 15,
    borderRadius: 50,
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
  },
  linkText: {
    color: '#2A94D6',
    fontSize: 16,
    marginTop: 15,
    fontFamily: 'OpenDyslexic-Regular',
  },
  registerText: {
    color: '#2A94D6',
    fontSize: 16,
    marginTop: 20,
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default LoginScreen;

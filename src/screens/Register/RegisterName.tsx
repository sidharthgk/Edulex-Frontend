import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

const RegisterName = ({ navigation }: any) => {
  const [name, setName] = useState('');
  let [fontsLoaded] = useFonts({
        'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
        'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
        'OpenDyslexic-itallic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
      });
      if (!fontsLoaded) {
        return null;
      }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your name?</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor="#6B7280"
      />
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('RegisterEmail')}
      >
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
    marginBottom: 20,
    color: '#000', // Text color
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterName;

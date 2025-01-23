import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const RegisterAge = ({ navigation }: any) => {
  const [age, setAge] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/backbutton.png')} style={styles.backButtonImage} />
      </TouchableOpacity>
      <Text style={styles.title}>How old are you?</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Enter your age"
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('RegisterName')}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('RegisterName')}>
        <Text style={styles.skipText}>Skip</Text>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonImage: {
    marginLeft: -20,
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 30,
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
  skipText: {
    marginTop: 10,
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default RegisterAge;

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

const RegisterName = ({ navigation }: any) => {
  const [name, setName] = useState('');
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
        <Text style={styles.title}>What is your name?</Text>

        {/* Name Input Field */}
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#888" // Updated placeholder color
        />

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('RegisterEmail')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
  },
  input: {
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
    paddingHorizontal: 50,
    borderRadius: 50,
  },
  nextButtonText: {
    color: '#FFFFFF', // White text stands out on the button
    fontFamily: 'OpenDyslexic-Bold',
    fontSize: 14,
  },
});

export default RegisterName;

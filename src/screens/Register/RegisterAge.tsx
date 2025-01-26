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

const RegisterAge = ({ navigation }: any) => {
  const [age, setAge] = useState('');
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    // Added KeyboardAvoidingView to adjust the layout when the keyboard appears
    <KeyboardAvoidingView
      style={styles.KeyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60} // Adjust this value if needed
    >
      {/* Wrapped content inside ScrollView to enable scrolling when needed */}
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../../assets/backbutton.png')}
            style={styles.backButtonImage}
          />
        </TouchableOpacity>
        <Text style={styles.title}>How old are you?</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Enter your age"
          placeholderTextColor="#888" // Updated placeholder color
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('RegisterName')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  KeyboardView: {
    flex: 1,
  },

  container: {
    flexGrow: 1, // Changed from flex: 1 to flexGrow: 1 for ScrollView compatibility
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60, // Positioned slightly below the top
    left: 20,
  },
  backButtonImage: {
    width: 80, // Keep original size
    height: 80,
    marginLeft: -20, // Maintain alignment
  },
  title: {
    fontSize: 20,
    color: '#3DB2FF', // Updated color to match theme
    fontFamily: 'OpenDyslexic-Bold', // Updated font family
    marginBottom: 20,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#3DB2FF', // Updated border color to match theme
    borderRadius: 50, // Updated input radius
    width: '80%',
    padding: 15, // Slightly increased padding
    marginBottom: 20,
    fontFamily: 'OpenDyslexic-Regular', // Updated font family
    fontSize: 14,
    color: '#333', // Darker text for input
  },
  nextButton: {
    backgroundColor: '#3DB2FF', // Updated button background color
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 50, // Updated button radius
  },
  nextButtonText: {
    color: '#FFFFFF', // White text for button
    fontFamily: 'OpenDyslexic-Bold', // Updated font family
  },
});

export default RegisterAge;

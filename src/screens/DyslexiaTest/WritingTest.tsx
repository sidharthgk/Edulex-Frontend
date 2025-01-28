import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { useFonts } from 'expo-font';

const HandWritingTest = ({ navigation }: any) => {
  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Handwriting Test</Text>
      <Image
              source={require('../../../assets/images/av-model.png')} // Path to the icon
              style={styles.icon}
      />

      {/* Instruction Box */}
      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsText}>
          Please follow the instructions below for the handwriting test:
        </Text>
        <Text style={styles.bulletPoint}>
          1. Take a blank sheet of paper and a pen.
        </Text>
        <Text style={styles.bulletPoint}>
          2. Write the following sentence clearly and legibly:
        </Text>
        <Text style={styles.sampleSentence}>
          "The quick brown fox jumps over the lazy dog."
        </Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate('PhotoCamera')}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  icon: {
    width: 300,
    height: 300,
    position: 'absolute',
    top: 65,
    left: 45,
  },
  instructionsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#3DB2FF',
    width: '100%',
    marginBottom: 30,
    marginTop: 230,
  },
  instructionsText: {
    fontSize: 18,
    color: '#4B5563',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 10,
    lineHeight: 22,
  },
  sampleSentence: {
    fontSize: 18,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 15,
    marginTop: 10,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default HandWritingTest;

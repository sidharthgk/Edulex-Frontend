import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Video, ResizeMode } from 'expo-av';
import { GlobalContext } from '../../GlobalState';

const TestResults = () => {
  const { state } = useContext(GlobalContext);
  const { photoUri, videoUri, dictationScore, quizScore } = state;
  const [showResults, setShowResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading fonts...</Text>
      </View>
    );
  }

  // Steps for the slideshow preview
  const previewSteps = [
    { label: '📸 Handwriting Photo', content: photoUri ? <Image source={{ uri: photoUri }} style={styles.mediaPreview} /> : <Text style={styles.placeholderText}>No photo uploaded</Text> },
    { label: '🎥 Eye Tracking Video', content: videoUri ? <Video source={{ uri: videoUri }} style={styles.videoPreview} resizeMode={ResizeMode.CONTAIN} shouldPlay isLooping useNativeControls /> : <Text style={styles.placeholderText}>No video recorded</Text> },
    { label: '📝 Dictation Test', content: <Text style={styles.scoreText}>Score: {dictationScore} / 2</Text> },
    { label: '🧠 Dyslexia Quiz', content: <Text style={styles.scoreText}>Score: {quizScore} / 5</Text> },
  ];

  // When user clicks "Get Results"
  if (showResults) {
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>📊 Final Diagnosis</Text>
        <Text style={styles.resultText}>
          {quizScore >= 3 && dictationScore >= 1
            ? 'Mild Dyslexia Detected. Consider further evaluation.'
            : 'No significant dyslexia indicators detected.'}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => setShowResults(false)}>
          <Text style={styles.backButtonText}>Back to Summary</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Test Summary</Text>

      {/* Slideshow Content */}
      <View style={styles.section}>
        <Text style={styles.label}>{previewSteps[currentStep].label}</Text>
        {previewSteps[currentStep].content}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.navButton} onPress={() => setCurrentStep(currentStep - 1)}>
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {currentStep < previewSteps.length - 1 ? (
          <TouchableOpacity style={styles.navButton} onPress={() => setCurrentStep(currentStep + 1)}>
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.getResultButton} onPress={() => setShowResults(true)}>
            <Text style={styles.getResultButtonText}>Get Results</Text>
          </TouchableOpacity>
        )}
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Regular',
  },
  title: {
    fontSize: 24,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 20,
  },
  section: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 10,
    color: '#3DB2FF',
  },
  mediaPreview: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  videoPreview: {
    width: 250,
    height: 250,
    borderRadius: 10,
    transform: [{ scaleX: -1 }], // MIRROR EFFECT FOR FRONT CAMERA
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#888',
  },
  scoreText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  navButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  navButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  getResultButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  getResultButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  resultTitle: {
    fontSize: 22,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default TestResults;

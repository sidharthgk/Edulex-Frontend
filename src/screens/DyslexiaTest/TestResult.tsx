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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Test Summary</Text>

      {/* Photo Preview */}
      <View style={[styles.section, styles.boxContainer]}>
        <Text style={styles.label}>📸 Handwriting Photo</Text>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.mediaPreview} />
        ) : (
          <Text style={styles.placeholderText}>No photo uploaded</Text>
        )}
      </View>

      {/* Video Preview */}
      <View style={[styles.section, styles.boxContainer]}>
        <Text style={styles.label}>🎥 Eye Tracking Video</Text>
        {videoUri ? (
          <Video
            source={{ uri: videoUri }}
            style={styles.videoPreview}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping
            useNativeControls
            isMuted={false}
          />
        ) : (
          <Text style={styles.placeholderText}>No video recorded</Text>
        )}
      </View>

      {/* Dictation Score */}
      <View style={[styles.section, styles.boxContainer]}>
        <Text style={styles.label}>📝 Dictation Test</Text>
        <Text style={styles.scoreText}>Score: {dictationScore} / 2</Text>
      </View>

      {/* Quiz Score */}
      <View style={[styles.section, styles.boxContainer]}>
        <Text style={styles.label}>🧠 Dyslexia Quiz</Text>
        <Text style={styles.scoreText}>Score: {quizScore} / 5</Text>
      </View>

      {!showResults ? (
        <TouchableOpacity style={styles.getResultButton} onPress={() => setShowResults(true)}>
          <Text style={styles.getResultButtonText}>Get Results</Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.resultContainer, styles.boxContainer]}>
          <Text style={styles.resultTitle}>📊 Final Diagnosis</Text>
          <Text style={styles.resultText}>
            {quizScore >= 3 && dictationScore >= 1
              ? 'Mild Dyslexia Detected. Consider further evaluation.'
              : 'No significant dyslexia indicators detected.'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
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
    fontSize: 30,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 20,
    marginTop: 15,
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
  getResultButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  getResultButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
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
  },
  // New style for boxes around each result
  boxContainer: {
    borderWidth: 2,        // Increased by 1px
    borderColor: '#3DB2FF', // Updated to match the text color
    borderRadius: 10,
    padding: 10,
  },
});
export default TestResults;

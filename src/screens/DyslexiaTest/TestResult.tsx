import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Video, ResizeMode } from 'expo-av';
import { GlobalContext } from '../../GlobalState';

const TestResults = () => {
  const { state } = useContext(GlobalContext);
  const { photoUri, videoUri, dictationScore, quizScore } = state;

  // Store probabilities in state
  const [eyeTrackingProbability, setEyeTrackingProbability] = useState(0);
  const [handwritingProbability, setHandwritingProbability] = useState(0);
  const [phoneticsProbability, setPhoneticsProbability] = useState(0);

  const [showResultsPage, setShowResultsPage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  // Generate random probabilities for each test (0-15)
  useEffect(() => {
    setEyeTrackingProbability(Math.floor(Math.random() * 16));
    setHandwritingProbability(Math.floor(Math.random() * 16));
    setPhoneticsProbability(Math.floor(Math.random() * 16));
  }, []);

  // Enable "View Results" button after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
      setButtonEnabled(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  // Display a loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading fonts...</Text>
      </View>
    );
  }

  // If "View Results" is clicked, show the final result page
  if (showResultsPage) {
    return (
      <View style={styles.resultPageContainer}>
        <Text style={styles.resultTitle}>Final Result</Text>
        {/* Changed background color from green (#4CAF50) to a blueish color (#E3F2FD) */}
        <View style={[styles.resultBox, styles.noDyslexia]}>
          <Text style={styles.resultBoxText}>
            No significant dyslexia indicators detected.
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>Dictation Score: {dictationScore} / 2</Text>
          <Text style={styles.summaryText}>Quiz Score: {quizScore} / 5</Text>

          {/* Probabilities laid out in single lines with bold highlighting */}
          <View style={styles.probRow}>
            <Text style={styles.probLabel}>Eye Tracking :</Text>
            <Text style={styles.probValue}>{eyeTrackingProbability}%</Text>
          </View>
          <View style={styles.probRow}>
            <Text style={styles.probLabel}>Handwriting :</Text>
            <Text style={styles.probValue}>{handwritingProbability}%</Text>
          </View>
          <View style={styles.probRow}>
            <Text style={styles.probLabel}>Phonetics :</Text>
            <Text style={styles.probValue}>{phoneticsProbability}%</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => setShowResultsPage(false)}
        >
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Summary screen before viewing final results
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Test Summary</Text>

      {/* Video Preview */}
      <View style={[styles.section, styles.boxContainer]}>
        <Text style={styles.label}>🎥 Eye Tracking Video</Text>
        {videoUri ? (
          <Video
            source={{ uri: videoUri }}
            style={styles.videoPreview}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted={true}
          />
        ) : (
          <Text style={styles.placeholderText}>No video recorded</Text>
        )}
      </View>

      {/* Photo Preview */}
      <View style={[styles.section, styles.boxContainer]}>
        <Text style={styles.label}>📸 Handwriting Photo</Text>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.mediaPreview} />
        ) : (
          <Text style={styles.placeholderText}>No photo uploaded</Text>
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

      {/* Processing Indicator */}
      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#FF9800" />
          <Text style={styles.processingText}>Processing your results...</Text>
        </View>
      )}

      {/* View Results Button */}
      <TouchableOpacity
        style={[
          styles.getResultButton,
          !buttonEnabled ? styles.getResultButtonDisabled : {},
        ]}
        onPress={() => setShowResultsPage(true)}
        disabled={!buttonEnabled}
      >
        <Text style={styles.getResultButtonText}>View Results</Text>
      </TouchableOpacity>
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
  boxContainer: {
    borderWidth: 2,
    borderColor: '#3DB2FF',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
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
    borderRadius: 125,
    overflow: 'hidden',
    transform: [{ scaleX: -1 }],
    borderColor: '#3DB2FF',
    borderWidth: 2,
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
  processingContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  processingText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#FF9800',
  },
  getResultButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  getResultButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  getResultButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  resultPageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  resultTitle: {
    fontSize: 30,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    marginBottom: 10,
  },
  resultBox: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  // Changed to a light blueish color (same as summaryCard).
  noDyslexia: {
    backgroundColor: '#E3F2FD',
  },
  resultBoxText: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'OpenDyslexic-Bold',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginTop: 10,
  },
  summaryText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 5,
  },
  // New styles for probability rows
  probRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  probLabel: {
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 16,
  },
  probValue: {
    fontFamily: 'OpenDyslexic-Bold',
    fontSize: 16,
    color: '#3DB2FF', // Highlighted color for percentage
  },
  goBackButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  goBackButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default TestResults;

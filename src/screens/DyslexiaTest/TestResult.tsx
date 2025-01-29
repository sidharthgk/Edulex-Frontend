import React, { useState, useContext, useEffect } from 'react';
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
import axios from 'axios';
import { GlobalContext } from '../../GlobalState';

const TestResults = () => {
  const { state } = useContext(GlobalContext);
  const { photoUri, videoUri, dictationScore, quizScore, taskID } = state;
  const [showResultsPage, setShowResultsPage] = useState(false);
  const [taskStatus, setTaskStatus] = useState('queued');
  const [taskResult, setTaskResult] = useState(null);

  useEffect(() => {
    console.log('Task ID:', taskID);
  }, [taskID]);

  useEffect(() => {
    if (!taskID) {return;}

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`http://detection.albinvar.in/queue/${taskID}`);
        console.log('API Response:', response.data);

        const { status, result } = response.data;
        setTaskStatus(status);

        if (status === 'completed') {
          setTaskResult(result);
          clearInterval(interval);
          setShowResultsPage(true);
        }
      } catch (error) {
        console.error('Error fetching task status:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [taskID]);

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

  if (showResultsPage) {
    return (
      <View style={styles.resultPageContainer}>
        <Text style={styles.resultTitle}>Final Result</Text>
        <Text style={styles.resultText}>
          {taskResult
            ? `Dyslexia Classification: ${JSON.parse(taskResult).handwriting_analysis.classification}`
            : 'No significant dyslexia indicators detected.'}
        </Text>
        <Text style={styles.taskIdText}>Task ID: {taskID}</Text>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => setShowResultsPage(false)}
        >
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

      {taskStatus !== 'completed' && (
        <Text style={styles.processingText}>Processing your results...</Text>
      )}

      <TouchableOpacity
        style={[
          styles.getResultButton,
          taskStatus !== 'completed' ? styles.getResultButtonDisabled : {},
        ]}
        onPress={() => setShowResultsPage(true)}
        disabled={taskStatus !== 'completed'}
      >
        <Text style={styles.getResultButtonText}>
          {taskStatus === 'completed' ? 'View Results' : 'View Results'}
        </Text>
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
  processingText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#FF9800',
    marginBottom: 10,
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
  taskIdText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#000',
    marginTop: 10,
  },
  goBackButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  goBackButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  boxContainer: {
    borderWidth: 2,
    borderColor: '#3DB2FF',
    borderRadius: 10,
    padding: 10,
  },
});

export default TestResults;

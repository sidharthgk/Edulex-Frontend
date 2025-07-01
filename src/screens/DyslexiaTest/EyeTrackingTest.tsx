import React, { useRef, useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { GlobalContext } from '../../GlobalState';
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
  PermissionStatus,
} from 'expo-camera';
import { useFonts } from 'expo-font';
import { Video, ResizeMode } from 'expo-av';

const EyeTrackingTest = ({ navigation }: any) => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cameraRef = useRef<CameraView | null>(null);
  const videoRef = useRef<Video | null>(null);
  const {state, setState} = useContext(GlobalContext);

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Fonts...</Text>
      </View>
    );
  }

  // Handle permissions
  if (!cameraPermission || !microphonePermission) {
    return <View />;
  }

  if (
    cameraPermission.status !== PermissionStatus.GRANTED ||
    microphonePermission.status !== PermissionStatus.GRANTED
  ) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>
          We need Camera and Microphone permissions to record a video.
        </Text>
        <View style={styles.permissionButtonContainer}>
          <TouchableOpacity
            onPress={async () => {
              await requestCameraPermission();
              await requestMicrophonePermission();
            }}
            style={styles.permissionButton}
          >
            <Text style={styles.permissionButtonText}>Grant Permissions</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleRecording = async () => {
    if (!isCameraReady) {
      console.warn('CameraView is not ready yet.');
      return;
    }

    if (isRecording) {
      try {
        await cameraRef.current?.stopRecording();
        setIsRecording(false);
        console.log('Recording stopped');
      } catch (error) {
        console.error('Error stopping recording:', error);
        setIsRecording(false);
      }
    } else {
      try {
        setIsRecording(true);
        const video = await cameraRef.current?.recordAsync();
        setIsRecording(false);

        if (video?.uri) {
          setVideoUri(video.uri);
          console.log('Recording finished, URI:', video.uri);
        }
      } catch (error) {
        console.error('Error starting recording:', error);
        setIsRecording(false);
      }
    }
  };

  const retake = () => {
    setVideoUri(null);
    console.log('Video retaken');
  };

  const submit = async () => {
    if (!videoUri || isSubmitting) {
      console.warn('No video to submit or already submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update global state with the video URI
      setState({ ...state, videoUri: videoUri });
      
      // Navigate to TestSubmitted screen
      navigation.navigate('TestSubmitted', {
        mediaType: 'video',
        videoUri: videoUri,
        testType: 'eyeTracking'
      });
      
      console.log('Eye tracking video submitted successfully:', videoUri);
    } catch (error) {
      console.error('Error submitting video:', error);
      // Could add alert or toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cameraPlaceholder}>
        {videoUri ? (
          <Video
            ref={videoRef}
            style={styles.videoPreview}
            source={{ uri: videoUri }}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted={true}
          />
        ) : (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
            mode="video"
            mute={false}
            onCameraReady={() => {
              console.log('CameraView is ready');
              setIsCameraReady(true);
            }}
          />
        )}
      </View>

      <View style={styles.paragraphBox}>
        <Text style={styles.paragraph}>
          The cat is on the mat. The dog runs fast. Look at the red ball. Can
          you find the star?
        </Text>
      </View>

      {videoUri ? (
        <View style={[styles.buttonContainer, { backgroundColor: '#F0F0F0', padding: 15, borderRadius: 10 }]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonRetake]}
            onPress={retake}
          >
            <Text style={styles.actionButtonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton, 
              styles.actionButtonSubmit,
              isSubmitting && styles.actionButtonDisabled
            ]}
            onPress={submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.actionButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              !isCameraReady
                ? styles.recordButtonDisabled
                : isRecording
                ? styles.recordButtonRecording
                : styles.recordButtonDefault,
            ]}
            onPress={toggleRecording}
            disabled={!isCameraReady}
          >
            <Text
              style={[
                styles.recordButtonText,
                isRecording
                  ? styles.recordButtonTextRecording
                  : isCameraReady
                  ? styles.recordButtonTextEnabled
                  : styles.recordButtonTextDisabled,
              ]}
            >
              {isRecording
                ? 'Stop Recording'
                : isCameraReady
                ? 'Start Recording'
                : 'Loading...'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default EyeTrackingTest;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingBottom: 120, // Increased to ensure buttons are visible
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 20,
    color: '#000000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#3DB2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },
  permissionButtonContainer: {
    marginBottom: 100,
  },
  permissionButton: {
    backgroundColor: '#FFFFFF',
    padding: 9,
    borderRadius: 50,
    alignItems: 'center',
    width: '90%',
    borderWidth: 2,
    borderColor: '#3DB2FF',
  },
  permissionButtonText: {
    color: '#3DB2FF',
    fontSize: 23,
    fontFamily: 'OpenDyslexic-Bold',
  },
  cameraPlaceholder: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3DB2FF',
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  paragraphBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    borderWidth: 1.5,
    borderColor: '#3DB2FF',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 20,
    lineHeight: 28,
    color: '#333333',
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    backgroundColor: 'transparent', // Ensure container is visible
  },
  recordButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordButtonDefault: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3DB2FF',
  },
  recordButtonRecording: {
    backgroundColor: '#FF6666',
    borderWidth: 0,
  },
  recordButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  recordButtonText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
  },
  recordButtonTextRecording: {
    color: '#FFFFFF',
  },
  recordButtonTextEnabled: {
    color: '#3DB2FF',
  },
  recordButtonTextDisabled: {
    color: '#888888',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    maxWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  actionButtonRetake: {
    backgroundColor: '#FF8C00',
    marginRight: 10,
  },
  actionButtonSubmit: {
    backgroundColor: '#3DB2FF',
    marginLeft: 10,
  },
  actionButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    textAlign: 'center',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    transform: [{ scaleX: -1 }], // MIRROR EFFECT
  },
});


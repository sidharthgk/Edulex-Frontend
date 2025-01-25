import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
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

  const cameraRef = useRef<CameraView | null>(null);
  const videoRef = useRef<Video | null>(null);

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-itallic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });
  if (!fontsLoaded) {
    return null;
  }

  // 1. Permissions are still loading
  if (!cameraPermission || !microphonePermission) {
    return <View />;
  }

  // 2. If camera or mic permission not granted, show UI to request them
  if (
    cameraPermission.status !== PermissionStatus.GRANTED ||
    microphonePermission.status !== PermissionStatus.GRANTED
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need Camera and Microphone permissions to record a video.
        </Text>
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
    );
  }

  // Start/Stop Recording
  const toggleRecording = async () => {
    if (!isCameraReady) {
      console.warn('CameraView is not ready yet.');
      return;
    }

    if (isRecording) {
      // Stop any ongoing recording
      try {
        await cameraRef.current?.stopRecording();
        setIsRecording(false);
        console.log('Recording stopped');
      } catch (error) {
        console.error('Error stopping recording:', error);
        setIsRecording(false);
      }
    } else {
      // Start a new recording
      try {
        setIsRecording(true); // Mark state as recording BEFORE calling recordAsync
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

  // User chose to retake
  const retake = () => {
    setVideoUri(null);
    console.log('Video retaken');
  };

  // User chose to submit
  const submit = () => {
    navigation.navigate('EyeTrackingTestSubmitted');
    console.log('Video submitted:', videoUri);
    // Add your own logic here, e.g. upload the video
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Circular container: either show CameraView OR Video preview */}
      <View style={styles.cameraPlaceholder}>
        {videoUri ? (
          // Show the recorded video in the same circle
          <Video
            ref={videoRef}
            style={styles.camera}
            source={{ uri: videoUri }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            isLooping
          />
        ) : (
          // Show live camera
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

      {/* Reading Paragraph Box */}
      <View style={styles.paragraphBox}>
        <Text style={styles.paragraph}>
          The cat is on the mat. The dog runs fast. Look at the red ball. Can
          you find the star?
        </Text>
      </View>

      {/* Buttons (Conditional) */}
      {videoUri ? (
        // If we have a recorded video, show 'Retake' and 'Submit'
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonRetake]}
            onPress={retake}
          >
            <Text style={styles.actionButtonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSubmit]}
            onPress={submit}
          >
            <Text style={styles.actionButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // If no video yet, show Record/Stop button
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              // Merge additional dynamic state-based styles
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
                isCameraReady
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF', // Match the LoginScreen background
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 16,
    color: '#FFFFFF', // Text matches the blue background
  },
  permissionButton: {
    backgroundColor: '#FFFFFF', // White button with blue text
    padding: 15,
    borderRadius: 50, // Rounded button
    alignItems: 'center',
    width: '70%', // Center the button with a defined width
    justifyContent: 'center',
  },
  permissionButtonText: {
    color: '#3DB2FF', // Blue text to match the theme
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
  },
  cameraPlaceholder: {
    width: 300,
    height: 300,
    borderRadius: 200, // Circle
    backgroundColor: '#FFFFFF', // White background for the camera area
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3DB2FF', // Blue border
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  paragraphBox: {
    backgroundColor: '#FFFFFF', // White box for the paragraph
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    borderWidth: 1.5,
    borderColor: '#3DB2FF', // Blue border
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333333', // Dark text for readability
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Regular',
  },

  // Button Containers
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },

  // Recording button (Start/Stop)
  recordButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50, // Rounded buttons
    alignItems: 'center',
    width: '90%',
  },
  recordButtonDefault: {
    backgroundColor: '#FFFFFF', // White button
  },
  recordButtonRecording: {
    backgroundColor: '#FF6666', // Red button for recording
  },
  recordButtonDisabled: {
    backgroundColor: '#CCCCCC', // Gray for disabled state
  },
  recordButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'OpenDyslexic-Bold',
  },
  recordButtonTextEnabled: {
    color: '#3DB2FF', // Blue text
  },
  recordButtonTextDisabled: {
    color: '#888888',
  },

  // Action buttons (Retake/Submit)
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  // Orange background for Retake
  actionButtonRetake: {
    backgroundColor: '#FF8C00',
  },
  // Blue background for Submit
  actionButtonSubmit: {
    backgroundColor: '#3DB2FF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default EyeTrackingTest;

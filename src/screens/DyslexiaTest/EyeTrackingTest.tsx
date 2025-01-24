import React from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFonts } from 'expo-font';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false); // Track CameraView readiness
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return null; // Wait until fonts are loaded
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Show permission request UI if permissions are not granted
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleRecording = async () => {
    if (!isCameraReady) {
      console.warn('CameraView is not ready yet.');
      return;
    }

    if (isRecording) {
      // Stop recording
      try {
        cameraRef.current?.stopRecording();
        setIsRecording(false);
        console.log('Recording stopped');
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    } else {
      // Start recording
      try {
        const video = await cameraRef.current?.recordAsync();
        setVideoUri(video?.uri || null);
        setIsRecording(true);
        console.log('Recording started:', video?.uri);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Circular Camera View */}
      <View style={styles.cameraPlaceholder}>
        <CameraView
          ref={(ref) => {
            cameraRef.current = ref;
          }}
          style={styles.camera}
          facing="front"
          mode="video"
          mute
          onCameraReady={() => {
            console.log('CameraView is ready');
            setIsCameraReady(true);
          }}
        />
      </View>

      {/* Reading Paragraph Box */}
      <View style={styles.paragraphBox}>
        <Text style={styles.paragraph}>
          The cat is on the mat. The dog runs fast. Look at the red ball. Can you find the star?
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.refreshButton,
            {
              backgroundColor: isCameraReady
                ? isRecording
                  ? '#FF6666' // Red when recording
                  : '#E9F5FF' // Light blue when ready
                : '#CCCCCC', // Grey when disabled
            },
          ]}
          onPress={toggleRecording}
          disabled={!isCameraReady} // Disable button if camera is not ready
        >
          <Text
            style={[
              styles.refreshButtonText,
              { color: isCameraReady ? '#007BFF' : '#888888' } // Grey text when disabled
            ]}
          >
            {isRecording ? 'Stop Recording' : isCameraReady ? 'Start Recording' : 'Loading...'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => console.log('Next')} // Replace with navigation logic if applicable
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Video URI Display */}
      {videoUri && (
        <Text style={styles.videoUriText}>Saved Video: {videoUri}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  permissionButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'OpenDyslexic-Regular',
  },
  cameraPlaceholder: {
    width: 300,
    height: 300,
    borderRadius: 200,
    backgroundColor: '#E9F5FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007BFF',
    overflow: 'hidden',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  paragraphBox: {
    backgroundColor: '#E9F5FF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 28,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'OpenDyslexic-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  refreshButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'OpenDyslexic-Regular',
  },
  nextButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'OpenDyslexic-Regular',
  },
  videoUriText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    color: '#007BFF',
    fontFamily: 'OpenDyslexic-Regular',
  },
});

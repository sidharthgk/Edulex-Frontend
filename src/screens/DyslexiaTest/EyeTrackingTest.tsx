import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView, // optional if you need scrolling
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
  PermissionStatus,
} from 'expo-camera';
import {useFonts} from 'expo-font';
// Import Video component from expo-av
import {Video} from 'expo-av';

export default function App() {
  // Request both camera & mic permissions
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const cameraRef = useRef<CameraView | null>(null);
  const videoRef = useRef<Video | null>(null);

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
          style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Once permissions are granted, show the camera UI
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Circular Camera View */}
      <View style={styles.cameraPlaceholder}>
        <CameraView
          ref={ref => {
            cameraRef.current = ref;
          }}
          style={styles.camera}
          facing="front"
          mode="video"
          // Set `mute` to false if you want audio recorded.
          mute={false}
          onCameraReady={() => {
            console.log('CameraView is ready');
            setIsCameraReady(true);
          }}
        />
      </View>

      {/* Reading Paragraph Box */}
      <View style={styles.paragraphBox}>
        <Text style={styles.paragraph}>
          The cat is on the mat. The dog runs fast. Look at the red ball. Can
          you find the star?
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
                : '#CCCCCC', // Gray when disabled
            },
          ]}
          onPress={toggleRecording}
          disabled={!isCameraReady}>
          <Text
            style={[
              styles.refreshButtonText,
              {color: isCameraReady ? '#007BFF' : '#888888'}, // Gray text when disabled
            ]}>
            {isRecording
              ? 'Stop Recording'
              : isCameraReady
              ? 'Start Recording'
              : 'Loading...'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => console.log('Next')}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Video URI & Preview */}
      {videoUri && (
        <>
          <Text style={styles.videoUriText}>Saved Video: {videoUri}</Text>
          <View style={styles.videoContainer}>
            <Video
              ref={ref => {
                videoRef.current = ref;
              }}
              style={styles.video}
              source={{uri: videoUri}}
              useNativeControls
              resizeMode="contain"
              isLooping
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontFamily: 'OpenDyslexic-Regular',
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
    marginBottom: 20,
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
    marginBottom: 20,
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
    marginBottom: 20,
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
  videoContainer: {
    width: '100%',
    height: 200,
    marginTop: 10,
    alignItems: 'center',
  },
  video: {
    width: '90%',
    height: '100%',
  },
});

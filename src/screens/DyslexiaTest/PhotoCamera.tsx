import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, useCameraPermissions, PermissionStatus } from 'expo-camera';

const PhotoCamera = ({ navigation, route }: any) => {
  const { setPhotoUri } = route.params;
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photoUri, setLocalPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  // 1. Permissions are still loading
  if (!cameraPermission) {
    return <View />;
  }

  // 2. If camera permission not granted, show UI to request it
  if (cameraPermission.status !== PermissionStatus.GRANTED) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>
          We need Camera permission to take a photo.
        </Text>
        <View style={styles.permissionButtonContainer}>
          <TouchableOpacity
            onPress={async () => {
              await requestCameraPermission();
            }}
            style={styles.permissionButton}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Take a photo
  const takePhoto = async () => {
    if (!isCameraReady) {
      console.warn('CameraView is not ready yet.');
      return;
    }

    try {
      const photo = await cameraRef.current?.takePictureAsync();
      if (photo?.uri) {
        setLocalPhotoUri(photo.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  // Retake a photo
  const retakePhoto = () => {
    setLocalPhotoUri(null);
  };

  // Submit the photo
  const submitPhoto = () => {
    setPhotoUri(photoUri);
    navigation.navigate('TestSubmitted', { mediaType: 'photo' });
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <Image style={styles.camera} source={{ uri: photoUri }} />
      ) : (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back" // Correct usage of CameraType
          mode="picture" // Correct mode for taking pictures
          onCameraReady={() => {
            console.log('CameraView is ready');
            setIsCameraReady(true);
          }}
        />
      )}
      <View style={styles.buttonContainer}>
        {photoUri ? (
          <>
            <TouchableOpacity
              style={[styles.captureButton, styles.retakeButton]}
              onPress={retakePhoto}
            >
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={submitPhoto}
            >
              <Text style={styles.captureButtonText}>Submit</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePhoto}
          >
            <Text style={styles.captureButtonText}>Capture</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background for the camera view
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  captureButton: {
    backgroundColor: '#3DB2FF', // Blue
    padding: 20,
    borderRadius: 50,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
  },
  // New style for permission screen to display white text
  permissionContainer: {
    flex: 1,
    backgroundColor: '#3DB2FF', // Blue background
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 16,
    color: '#FFFFFF', // White text against blue background
  },
  permissionButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  permissionButton: {
    backgroundColor: '#FFFFFF', // White button with blue text
    padding: 9,
    borderRadius: 50, // Rounded button
    alignItems: 'center',
    width: '90%', // Center the button with a defined width
    borderWidth: 2, // Add border width
    borderColor: '#3DB2FF', // Blue border color
  },
  permissionButtonText: {
    color: '#3DB2FF', // Blue text
    fontSize: 23,
    fontFamily: 'OpenDyslexic-Bold',
  },
  // New style for the Retake button
  retakeButton: {
    backgroundColor: '#FFA500', // Orange color
  },
  retakeButtonText: {
    color: '#FFFFFF', // White text for better contrast
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default PhotoCamera;

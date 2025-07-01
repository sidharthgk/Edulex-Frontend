import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Vibration,
  Image,
  Platform,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, PermissionStatus } from 'expo-camera';
import { GlobalContext } from '../GlobalState';

const CameraScreen = () => {
  const insets = useSafeAreaInsets();
  const { setCameraCapturing } = useContext(GlobalContext);
  const [ocrMode, setOcrMode] = useState<'camera' | 'capture' | 'results'>('camera');
  const [scannedText, setScannedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  
  // Update global state when camera mode changes
  useEffect(() => {
    setCameraCapturing(ocrMode === 'capture');
  }, [ocrMode, setCameraCapturing]);

  // Load custom fonts
  
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  const openCamera = () => {
    setOcrMode('capture');
    setPhotoUri(null);
  };

  const takePhoto = async () => {
    if (!isCameraReady) {
      Alert.alert('Camera Not Ready', 'Please wait for the camera to initialize.');
      return;
    }

    try {
      const photo = await cameraRef.current?.takePictureAsync();
      if (photo?.uri) {
        setPhotoUri(photo.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const retakePhoto = () => {
    setPhotoUri(null);
  };

  // Get the correct API endpoint based on platform and environment
  const getOCRApiEndpoint = () => {
    // For Expo Go on physical devices, we need to use the computer's IP address
    // Using the actual IP address from ipconfig
    const COMPUTER_IP = '192.168.0.87'; // Your computer's actual IP address
    
    if (__DEV__) {
      // Development mode
      if (Platform.OS === 'android') {
        // Check if running on Expo Go (physical device) or emulator
        return `http://${COMPUTER_IP}:8000/ocr`; // For Expo Go on Android device
      } else if (Platform.OS === 'ios') {
        // For Expo Go on iPhone, use computer's IP
        return `http://${COMPUTER_IP}:8000/ocr`; // For Expo Go on iOS device
      }
    } else {
      // Production mode
      return `http://${COMPUTER_IP}:8000/ocr`;
    }
    
    // Fallback
    return 'http://localhost:8000/ocr';
  };

  const processPhoto = async () => {
    if (!photoUri) return;
    
    setIsProcessing(true);
    Vibration.vibrate(100);
    
    console.log('🚀 OCR API: Starting image processing...');
    console.log('📸 Photo URI:', photoUri);
    
    try {
      // Create form data for the API request
      const formData = new FormData();
      
      // Get the filename from the URI
      const filename = photoUri.split('/').pop() || 'captured_image.jpg';
      console.log('📄 Filename:', filename);
      
      const apiEndpoint = getOCRApiEndpoint();
      console.log('🌐 Platform:', Platform.OS);
      console.log('📡 OCR API Endpoint:', apiEndpoint);
      
      // Add the image file to form data
      formData.append('file', {
        uri: photoUri,
        type: 'image/jpeg',
        name: filename,
      } as any);

      console.log('📡 OCR API: Making request to', apiEndpoint);
      console.log('📤 Request method: POST');
      console.log('📋 Content-Type: multipart/form-data');
      
      const requestStartTime = Date.now();

      // Make API request to OCR endpoint
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const requestEndTime = Date.now();
      const requestDuration = requestEndTime - requestStartTime;

      console.log(`⏱️ OCR API: Request completed in ${requestDuration}ms`);
      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      const result = await response.json();
      
      console.log('🔍 OCR API Response:');
      console.log(JSON.stringify(result, null, 2));

      if (result.success) {
        if (result.text && result.text.trim().length > 0) {
          console.log('✅ OCR Success!');
          console.log('📝 Extracted text length:', result.text_length);
          console.log('📄 Extracted text preview:', result.text.substring(0, 100) + (result.text.length > 100 ? '...' : ''));
          
          setScannedText(result.text);
          setOcrMode('results');
          Alert.alert('✅ Text Captured!', `Successfully extracted ${result.text_length} characters from the image.`);
        } else {
          console.log('⚠️ OCR Success but no text found');
          console.log('📄 Image processed but no readable text detected');
          
          Alert.alert(
            '📷 No Text Detected', 
            'The image was processed successfully, but no readable text was found. Try:\n\n• Taking a clearer photo\n• Ensuring good lighting\n• Focusing on text areas\n• Using a image with clear, readable text',
            [
              { text: 'Retake Photo', onPress: () => setPhotoUri(null) },
              { text: 'Try Demo', onPress: () => {
                console.log('🔄 Using demo text for testing');
                const demoText = "This is a demo text to show how the OCR results would look when text is successfully detected from an image.";
                setScannedText(demoText);
                setOcrMode('results');
              }}
            ]
          );
        }
      } else {
        console.log('❌ OCR Failed - API returned success: false');
        console.log('🔍 Response details:', result);
        throw new Error(result.message || 'Failed to extract text from image');
      }

    } catch (error) {
      console.error('💥 OCR API Error:', error);
      
      // Properly handle error logging with type checking
      if (error instanceof Error) {
        console.error('🔍 Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      } else {
        console.error('🔍 Unknown error type:', error);
      }
      
      // Provide specific troubleshooting based on error type
      let troubleshootingMessage = 'Please ensure the OCR service is running and accessible.';
      
      if (error instanceof Error && error.message.includes('Network request failed')) {
        troubleshootingMessage = `Network connection failed for Expo Go.

📱 Expo Go Setup Instructions:

1️⃣ Find your computer's IP address:
   • Windows: Open CMD → type "ipconfig" → look for IPv4 Address
   • Mac: System Preferences → Network → look for IP Address  
   • Linux: Terminal → type "hostname -I"

2️⃣ Update the code:
   • Open CameraScreen.tsx
   • Find line: const COMPUTER_IP = '192.168.1.100';
   • Replace with your actual IP address

3️⃣ Make sure both devices are on the same WiFi network

4️⃣ Test connection:
   • Try: curl http://YOUR_IP:8000/ocr

Current endpoint: ${getOCRApiEndpoint()}

🔧 Common issues:
• Computer firewall blocking port 8000
• Different WiFi networks
• Wrong IP address in code`;
      }
      
      // Fallback to sample text if API fails
      Alert.alert(
        '⚠️ OCR Service Unavailable', 
        troubleshootingMessage,
        [{ text: 'OK', onPress: () => {
          console.log('🔄 Using fallback demo text');
          const fallbackText = "This is a demo text since the OCR service is not available. The actual service would extract text from your captured image.";
          setScannedText(fallbackText);
          setOcrMode('results');
        }}]
      );
    } finally {
      setIsProcessing(false);
      console.log('🏁 OCR API: Processing completed');
    }
  };

  const speakText = () => {
    Alert.alert('🔊 Text-to-Speech', 'In a real app, this would read the text aloud using the device\'s TTS engine.');
    Vibration.vibrate([100, 50, 100]);
  };

  const getAIExplanation = () => {
    const explanations = [
      "This text is great for practicing reading fluency. Try reading it slowly and focus on pronunciation.",
      "Notice the complex words in this text. Break them down into syllables to make reading easier.",
      "This sentence has good rhythm. Practice reading it with expression and natural pauses.",
      "Look for familiar word patterns. This helps build reading confidence and speed.",
      "Pay attention to punctuation marks - they help you understand the meaning better."
    ];
    
    const randomExplanation = explanations[Math.floor(Math.random() * explanations.length)];
    Alert.alert('🤖 AI Teacher Says:', randomExplanation);
  };

  const highlightDifficultWords = () => {
    Alert.alert('🎯 Word Analysis', 'Difficult words would be highlighted in different colors based on reading level and dyslexia-friendly patterns.');
  };

  const resetCamera = () => {
    setOcrMode('camera');
    setScannedText('');
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 100 }}>Loading...</Text>
      </View>
    );
  }

  // Camera capture mode
  if (ocrMode === 'capture') {
    if (!cameraPermission) {
      return <View style={styles.container}><Text style={styles.loadingText}>Loading camera...</Text></View>;
    }

    if (cameraPermission.status !== PermissionStatus.GRANTED) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionMessage}>
            We need camera permission to scan text.
          </Text>
          <TouchableOpacity
            onPress={requestCameraPermission}
            style={styles.permissionButton}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <View style={[styles.cameraHeader, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => setOcrMode('camera')}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.cameraHeaderTitle}>Capture Text</Text>
        </View>

        {photoUri ? (
          <Image style={styles.camera} source={{ uri: photoUri }} />
        ) : (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            mode="picture"
            onCameraReady={() => setIsCameraReady(true)}
          />
        )}

        <View style={styles.cameraButtonContainer}>
          {photoUri ? (
            <>
              <TouchableOpacity style={[styles.cameraButton, styles.retakeButton]} onPress={retakePhoto}>
                <Text style={styles.cameraButtonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraButton} onPress={processPhoto}>
                <Text style={styles.cameraButtonText}>Process</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
              <Ionicons name="camera" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (ocrMode === 'results') {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity style={styles.backButton} onPress={resetCamera}>
            <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scanned Text</Text>
        </View>

        <ScrollView 
          style={styles.resultsContainer} 
          contentContainerStyle={styles.scrollableContent}
          showsVerticalScrollIndicator={true}
        >
          {/* Scanned Text Display */}
          <View style={styles.textContainer}>
            <Text style={styles.scannedText}>{scannedText}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={speakText}>
              <Ionicons name="volume-high" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Read Aloud</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={getAIExplanation}>
              <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>AI Help</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={highlightDifficultWords}>
              <Ionicons name="color-wand" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Highlight</Text>
            </TouchableOpacity>
          </View>

          {/* Learning Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Learning Tips</Text>
            <View style={styles.tipItem}>
              <Ionicons name="eye" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Read slowly and focus on each word</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="ear" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Use the read-aloud feature to hear pronunciation</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="hand-left" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Cover part of the text to reduce overwhelm</Text>
            </View>
          </View>

          {/* Additional Learning Resources */}
          <View style={styles.resourcesContainer}>
            <Text style={styles.resourcesTitle}>📚 Additional Resources</Text>
            <TouchableOpacity style={styles.resourceItem} onPress={() => Alert.alert('📖 Reading Guide', 'Access comprehensive reading strategies and techniques.')}>
              <Ionicons name="book" size={20} color="#2196F3" />
              <Text style={styles.resourceText}>Reading Strategies Guide</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceItem} onPress={() => Alert.alert('🔤 Vocabulary', 'Expand your vocabulary with word definitions and examples.')}>
              <Ionicons name="library" size={20} color="#4CAF50" />
              <Text style={styles.resourceText}>Vocabulary Builder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceItem} onPress={() => Alert.alert('🎯 Practice', 'Try interactive exercises based on this text.')}>
              <Ionicons name="game-controller" size={20} color="#FF9800" />
              <Text style={styles.resourceText}>Practice Exercises</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>OCR Camera</Text>
        <Text style={styles.headerSubtitle}>Scan text and learn with AI assistance</Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.cameraCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="camera-outline" size={80} color="#3DB2FF" />
          </View>
          
          {isProcessing && (
            <View style={styles.processingContainer}>
              <Text style={styles.processingText}>🔍 Analyzing image...</Text>
              <Text style={styles.processingSubtext}>Extracting text using OCR technology</Text>
            </View>
          )}
          
          {!isProcessing && (
            <>
              <Text style={styles.title}>Smart Text Recognition</Text>
              <Text style={styles.description}>
                Point your camera at any text and our AI will help you learn and understand it better with personalized explanations.
              </Text>
              
              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <Ionicons name="scan-outline" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Text Recognition</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="volume-high-outline" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Text-to-Speech</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="chatbubble-outline" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>AI Explanations</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="color-wand-outline" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Word Highlighting</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.startButton} 
                onPress={openCamera}
                disabled={isProcessing}
              >
                <Ionicons name="camera" size={24} color="#FFFFFF" />
                <Text style={styles.startButtonText}>Capture Text</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Usage Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Use:</Text>
          <Text style={styles.instructionText}>1. Point camera at clear, readable text</Text>
          <Text style={styles.instructionText}>2. Tap "Capture Text" button</Text>
          <Text style={styles.instructionText}>3. Wait for AI processing</Text>
          <Text style={styles.instructionText}>4. Get personalized learning assistance</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 70,
    padding: 8,
  },
  headerTitle: {
    fontSize: 28,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  cameraCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  processingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  processingText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    marginBottom: 5,
  },
  processingSubtext: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
  },
  title: {
    fontSize: 22,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#555555',
    fontFamily: 'OpenDyslexic-Regular',
    marginLeft: 12,
  },
  startButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#3DB2FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 8,
  },
  instructionsContainer: {
    backgroundColor: '#FFF9C4',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  instructionsTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#5D4037',
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#5D4037',
    marginBottom: 8,
    paddingLeft: 10,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  textContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#E3F2FD',
  },
  scannedText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    lineHeight: 28,
    textAlign: 'left',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    minWidth: 90,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Bold',
    marginTop: 5,
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  tipsTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2E7D32',
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#2E7D32',
    marginLeft: 10,
    flex: 1,
  },
  scrollableContent: {
    paddingBottom: 140,
  },
  resourcesContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  resourcesTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#1976D2',
    marginBottom: 15,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resourceText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 140,
    justifyContent: 'center',
    flexGrow: 1,
  },
  // Camera styles
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#3DB2FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionMessage: {
    textAlign: 'center',
    paddingBottom: 20,
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 18,
    color: '#FFFFFF',
  },
  permissionButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '80%',
    borderWidth: 2,
    borderColor: '#3DB2FF',
  },
  permissionButtonText: {
    color: '#3DB2FF',
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cameraHeaderTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 40, // Offset for back button
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  cameraButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#3DB2FF',
    padding: 20,
    borderRadius: 50,
    marginHorizontal: 10,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
  },
  retakeButton: {
    backgroundColor: '#FFA500',
  },
});

export default CameraScreen; 
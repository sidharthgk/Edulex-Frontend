import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Video, ResizeMode } from 'expo-av';
import { GlobalContext } from '../GlobalState';
import { avatarTalkService, AvatarTalkRequest } from '../services/avatarTalkService';
import { ocrService } from '../services/ocrService';
import { AVATAR_OPTIONS, EMOTION_OPTIONS, LANGUAGE_OPTIONS } from '../constants/config';

type QuizStep = 'intro' | 'camera' | 'capture' | 'processing' | 'text_review' | 'avatar_config' | 'video_generation' | 'learning';

interface LearningSession {
  id: string;
  originalText: string;
  learningContent: string;
  videoUrl?: string;
  avatar: string;
  emotion: string;
  language: string;
  createdAt: Date;
}

const QuizScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { setCameraCapturing } = useContext(GlobalContext);
  const [currentStep, setCurrentStep] = useState<QuizStep>('intro');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [_photoUri, setPhotoUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [learningContent, setLearningContent] = useState('');
  const [_isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  
  // Avatar configuration
  const [selectedAvatar, setSelectedAvatar] = useState('black_man');
  const [selectedEmotion, setSelectedEmotion] = useState('happy');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Learning session
  const [_currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const cameraRef = useRef<CameraView | null>(null);

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  // Update global state when camera mode changes
  useEffect(() => {
    setCameraCapturing(currentStep === 'capture');
  }, [currentStep, setCameraCapturing]);

  const startQuiz = () => {
    setCurrentStep('camera');
  };

  const openCamera = async () => {
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert('Camera Permission', 'Camera access is required to capture learning content.');
        return;
      }
    }
    setCurrentStep('capture');
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
        setCurrentStep('processing');
        await processImage(photo.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const retakePhoto = () => {
    setPhotoUri(null);
    setCurrentStep('capture');
  };

  const processImage = async (_imageUri: string) => {
    setIsProcessing(true);
    setProcessingMessage('Extracting text from image...');
    
    try {
      // For now, using demo text as requested until you integrate with your OCR API
      console.log('🎯 QuizScreen: Using demo text (OCR integration ready)');
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));
      
      // Use OCR service to generate demo text
      const ocrResult = ocrService.generateDemoText();
      
      if (ocrResult.success && ocrResult.text) {
        setExtractedText(ocrResult.text);
        
        // Set learning content as the same as extracted text (as requested)
        setLearningContent(ocrResult.text);
        
        setProcessingMessage('Creating learning content...');
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
        
        setCurrentStep('text_review');
      } else {
        throw new Error('Failed to generate demo content');
      }
      
      // TODO: When ready to integrate with real OCR, uncomment the following:
      /*
      const ocrResult = await ocrService.extractTextFromImage(imageUri);
      
      if (ocrResult.success && ocrResult.text) {
        setExtractedText(ocrResult.text);
        setLearningContent(ocrResult.text);
        setProcessingMessage('Creating learning content...');
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
        setCurrentStep('text_review');
      } else {
        Alert.alert('No Text Found', ocrResult.message || 'No readable text was found in the image.');
        setCurrentStep('capture');
      }
      */
      
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Processing Error', 'Failed to extract text from image. Please try again.');
      setCurrentStep('capture');
    } finally {
      setIsProcessing(false);
    }
  };

  const proceedToAvatarConfig = () => {
    setCurrentStep('avatar_config');
  };

  const generateAvatarVideo = async () => {
    if (!learningContent) {
      Alert.alert('Error', 'No learning content available.');
      return;
    }

    setCurrentStep('video_generation');
    setIsProcessing(true);
    setProcessingMessage('Generating avatar video...');

    try {
      const request: AvatarTalkRequest = {
        text: avatarTalkService.truncateText(learningContent),
        avatar: selectedAvatar,
        emotion: selectedEmotion,
        language: selectedLanguage,
      };

      const response = await avatarTalkService.generateVideo(request);
      
      setVideoUrl(response.mp4_url);
      
      // Create learning session
      const session: LearningSession = {
        id: response.id,
        originalText: extractedText,
        learningContent: learningContent,
        videoUrl: response.mp4_url,
        avatar: selectedAvatar,
        emotion: selectedEmotion,
        language: selectedLanguage,
        createdAt: new Date(),
      };
      
      setCurrentSession(session);
      setCurrentStep('learning');
      
      Vibration.vibrate(200);
      Alert.alert('✅ Video Generated!', 'Your personalized learning video is ready!');
      
    } catch (error) {
      console.error('Error generating avatar video:', error);
      Alert.alert('Generation Error', 'Failed to generate avatar video. Please try again.');
      setCurrentStep('avatar_config');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep('intro');
    setPhotoUri(null);
    setExtractedText('');
    setLearningContent('');
    setVideoUrl(null);
    setCurrentSession(null);
  };

  const renderIntroStep = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Learning Quiz</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeCard}>
          <Ionicons name="school" size={60} color="#3DB2FF" />
          <Text style={styles.welcomeTitle}>Personalized Learning</Text>
          <Text style={styles.welcomeDescription}>
            Take a photo of any text you want to learn from, and our AI will create a personalized learning experience with an avatar teacher!
          </Text>
        </View>

        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>How it works:</Text>
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <Ionicons name="camera" size={24} color="#4CAF50" />
              <Text style={styles.stepText}>1. Take a photo of text</Text>
            </View>
            <View style={styles.stepItem}>
              <Ionicons name="scan" size={24} color="#2196F3" />
              <Text style={styles.stepText}>2. AI extracts the content</Text>
            </View>
            <View style={styles.stepItem}>
              <Ionicons name="person" size={24} color="#FF9800" />
              <Text style={styles.stepText}>3. Choose your avatar teacher</Text>
            </View>
            <View style={styles.stepItem}>
              <Ionicons name="play-circle" size={24} color="#9C27B0" />
              <Text style={styles.stepText}>4. Watch & learn!</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
          <Text style={styles.startButtonText}>Start Learning</Text>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderCameraStep = () => (
    <View style={styles.container}>
      <View style={[styles.cameraHeader, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.cameraBackButton} onPress={() => setCurrentStep('intro')}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.cameraHeaderTitle}>Capture Learning Content</Text>
      </View>

      <View style={styles.cameraInstructions}>
        <Text style={styles.instructionText}>Position text clearly in the camera view</Text>
        <Text style={styles.instructionSubtext}>Make sure the text is well-lit and in focus</Text>
      </View>

      <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
        <Ionicons name="camera" size={40} color="#FFFFFF" />
        <Text style={styles.cameraButtonText}>Open Camera</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCaptureStep = () => (
    <View style={styles.fullScreenContainer}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        onCameraReady={() => setIsCameraReady(true)}
      />
      
      <View style={[styles.cameraOverlay, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.overlayBackButton} onPress={() => setCurrentStep('camera')}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.overlayTitle}>Capture Text</Text>
      </View>

      <View style={styles.cameraControls}>
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <View style={styles.captureButtonInner}>
            <Ionicons name="camera" size={30} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProcessingStep = () => (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Processing Image</Text>
      </View>

      <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color="#3DB2FF" />
        <Text style={styles.processingText}>{processingMessage}</Text>
        <Text style={styles.processingSubtext}>This may take a few moments...</Text>
      </View>
    </View>
  );

  const renderTextReviewStep = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={retakePhoto}>
          <Ionicons name="camera" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Extracted Content</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>📖 Extracted Text</Text>
        <View style={styles.textReviewCard}>
          <Text style={styles.extractedText}>{extractedText}</Text>
        </View>

        <Text style={styles.sectionTitle}>🎓 Learning Content</Text>
        <View style={styles.textReviewCard}>
          <Text style={styles.learningContentText}>{learningContent}</Text>
        </View>

        <TouchableOpacity style={styles.proceedButton} onPress={proceedToAvatarConfig}>
          <Text style={styles.proceedButtonText}>Choose Avatar Teacher</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderAvatarConfigStep = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep('text_review')}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Teacher</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>👨‍🏫 Avatar Teacher</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScrollView}>
          {AVATAR_OPTIONS.map((avatar) => (
            <TouchableOpacity
              key={avatar.id}
              style={[
                styles.optionCard,
                selectedAvatar === avatar.id && styles.selectedOptionCard
              ]}
              onPress={() => setSelectedAvatar(avatar.id)}
            >
              <Text style={styles.optionEmoji}>{avatar.emoji}</Text>
              <Text style={styles.optionName}>{avatar.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>😊 Emotion</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScrollView}>
          {EMOTION_OPTIONS.map((emotion) => (
            <TouchableOpacity
              key={emotion.id}
              style={[
                styles.optionCard,
                selectedEmotion === emotion.id && styles.selectedOptionCard
              ]}
              onPress={() => setSelectedEmotion(emotion.id)}
            >
              <Text style={styles.optionEmoji}>{emotion.emoji}</Text>
              <Text style={styles.optionName}>{emotion.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>🌍 Language</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScrollView}>
          {LANGUAGE_OPTIONS.map((language) => (
            <TouchableOpacity
              key={language.id}
              style={[
                styles.optionCard,
                selectedLanguage === language.id && styles.selectedOptionCard
              ]}
              onPress={() => setSelectedLanguage(language.id)}
            >
              <Text style={styles.optionEmoji}>{language.emoji}</Text>
              <Text style={styles.optionName}>{language.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.generateButton} onPress={generateAvatarVideo}>
          <Text style={styles.generateButtonText}>Generate Learning Video</Text>
          <Ionicons name="videocam" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderVideoGenerationStep = () => (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Generating Video</Text>
      </View>

      <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color="#3DB2FF" />
        <Text style={styles.processingText}>{processingMessage}</Text>
        <Text style={styles.processingSubtext}>Creating your personalized learning experience...</Text>
        
        <View style={styles.avatarPreview}>
          <Text style={styles.avatarPreviewText}>
            {AVATAR_OPTIONS.find(a => a.id === selectedAvatar)?.emoji} {AVATAR_OPTIONS.find(a => a.id === selectedAvatar)?.name}
          </Text>
          <Text style={styles.avatarPreviewEmotion}>
            {EMOTION_OPTIONS.find(e => e.id === selectedEmotion)?.emoji} {EMOTION_OPTIONS.find(e => e.id === selectedEmotion)?.name}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderLearningStep = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={resetQuiz}>
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Session</Text>
      </View>

      <View style={styles.content}>
        {videoUrl && (
          <View style={styles.videoContainer}>
            <Text style={styles.sectionTitle}>🎬 Your Learning Video</Text>
            <Video
              source={{ uri: videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={false}
            />
          </View>
        )}

        <View style={styles.sessionInfo}>
          <Text style={styles.sectionTitle}>📚 Session Details</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Avatar Teacher:</Text>
            <Text style={styles.infoValue}>
              {AVATAR_OPTIONS.find(a => a.id === selectedAvatar)?.emoji} {AVATAR_OPTIONS.find(a => a.id === selectedAvatar)?.name}
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Content Length:</Text>
            <Text style={styles.infoValue}>{learningContent.length} characters</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.secondaryButton} onPress={resetQuiz}>
            <Ionicons name="add" size={20} color="#3DB2FF" />
            <Text style={styles.secondaryButtonText}>Create New</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()}>
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3DB2FF" />
      </View>
    );
  }

  // Render current step
  switch (currentStep) {
    case 'intro':
      return renderIntroStep();
    case 'camera':
      return renderCameraStep();
    case 'capture':
      return renderCaptureStep();
    case 'processing':
      return renderProcessingStep();
    case 'text_review':
      return renderTextReviewStep();
    case 'avatar_config':
      return renderAvatarConfigStep();
    case 'video_generation':
      return renderVideoGenerationStep();
    case 'learning':
      return renderLearningStep();
    default:
      return renderIntroStep();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#3DB2FF',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraHeader: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBackButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cameraHeaderTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginVertical: 15,
  },
  welcomeDescription: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
  },
  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stepsTitle: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  stepsList: {
    gap: 15,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  stepText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#34495E',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#3DB2FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FFFFFF',
  },
  cameraInstructions: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginHorizontal: 20,
    marginTop: 100,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionSubtext: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#7F8C8D',
    textAlign: 'center',
  },
  cameraButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 40,
    gap: 10,
  },
  cameraButtonText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayBackButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FFFFFF',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3DB2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  processingText: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 20,
  },
  processingSubtext: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  textReviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  extractedText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#2C3E50',
    lineHeight: 24,
  },
  learningContentText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#27AE60',
    lineHeight: 24,
  },
  proceedButton: {
    backgroundColor: '#27AE60',
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  proceedButtonText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FFFFFF',
  },
  optionsScrollView: {
    marginBottom: 25,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOptionCard: {
    borderColor: '#3DB2FF',
    backgroundColor: '#E3F2FD',
  },
  optionEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  optionName: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  generateButtonText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FFFFFF',
  },
  avatarPreview: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  avatarPreviewText: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  avatarPreviewEmotion: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#7F8C8D',
  },
  videoContainer: {
    marginBottom: 25,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    backgroundColor: '#000000',
  },
  sessionInfo: {
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#7F8C8D',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#2C3E50',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#27AE60',
    borderRadius: 15,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#3DB2FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
  },
});

export default QuizScreen; 
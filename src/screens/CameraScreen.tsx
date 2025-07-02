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
  TextInput,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '../hooks/useAppStyles';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions, PermissionStatus } from 'expo-camera';
import { Video, ResizeMode } from 'expo-av';
import { GlobalContext } from '../GlobalState';
import { avatarTalkService, AvatarTalkRequest } from '../services/avatarTalkService';
import { ocrService, TeachingPlanAction } from '../services/ocrService';
import { AVATAR_OPTIONS, EMOTION_OPTIONS, LANGUAGE_OPTIONS } from '../constants/config';

const CameraScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { setCameraCapturing } = useContext(GlobalContext);
  const { theme, styles: globalStyles } = useAppStyles();
  const [ocrMode, setOcrMode] = useState<'selection' | 'camera' | 'capture' | 'text_input' | 'document_upload' | 'results' | 'learning_content' | 'avatar_config' | 'video_generation' | 'learning'>('selection');
  const [scannedText, setScannedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [processingMessage, setProcessingMessage] = useState('');
  const [_teachingPlan, setTeachingPlan] = useState<TeachingPlanAction[]>([]);
  const [learningContent, setLearningContent] = useState('');
  const [inputText, setInputText] = useState('');
  const [_selectedDocument, setSelectedDocument] = useState<any>(null);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [extractedImages, setExtractedImages] = useState<Array<{
    page: number;
    url: string;
    bbox: any;
    type: string;
  }>>([]);

  // Avatar configuration
  const [selectedAvatar, setSelectedAvatar] = useState('black_man');
  const [selectedEmotion, setSelectedEmotion] = useState('happy');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

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

  const openGallery = async () => {
    try {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setPhotoUri(selectedImage.uri);
        setOcrMode('capture'); // Go to camera mode to show the selected image
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('Error', 'Failed to open gallery. Please try again.');
    }
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



  const processPhoto = async () => {
    if (!photoUri) {return;}

    setIsProcessing(true);
    setProcessingMessage('Extracting text from image...');
    Vibration.vibrate(100);

    try {
      // Step 1: Extract text using OCR
      console.log('🚀 Starting OCR processing...');
      const ocrResult = await ocrService.extractTextFromImage(photoUri);

      if (!ocrResult.success || !ocrResult.text) {
        Alert.alert('OCR Failed', ocrResult.message || 'Failed to extract text from image. Please try again.');
        setOcrMode('capture');
        return;
      }

      console.log('✅ OCR Success - Text extracted');
      setScannedText(ocrResult.text);
      setExtractedImages(ocrResult.images || []);

      console.log('🖼️ Setting extracted images:', ocrResult.images?.length || 0);

      // Step 2: Generate teaching plan
      setProcessingMessage('Generating personalized learning content...');
      console.log('🎓 Generating teaching plan...');

      const teachingPlanResult = await ocrService.generateTeachingPlan(ocrResult.text);

      if (teachingPlanResult.success && teachingPlanResult.data) {
        console.log('✅ Teaching Plan Generated');
        setTeachingPlan(teachingPlanResult.data);

        // Format teaching plan for avatar
        const formattedContent = ocrService.formatTeachingPlanForAvatar(teachingPlanResult.data);
        setLearningContent(formattedContent);

        setOcrMode('results');
        Alert.alert(
          '✅ Content Processed!',
          `Successfully extracted text and generated ${teachingPlanResult.data.length} personalized learning activities!`
        );
      } else {
        console.log('⚠️ Teaching plan generation failed, using extracted text');
        // Fallback: use the extracted text as learning content
        setLearningContent(ocrResult.text);
        setOcrMode('results');
        Alert.alert(
          '✅ Text Extracted!',
          'Text extracted successfully. Teaching plan generation had issues, but you can still create an avatar video!'
        );
      }

    } catch (error) {
      console.error('💥 Processing Error:', error);

      let errorMessage = 'Failed to process the image. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert(
        '❌ Processing Failed',
        errorMessage,
        [
          { text: 'Retry', onPress: processPhoto },
          { text: 'Use Demo', onPress: () => {
            const demoText = 'Reading is a complex cognitive process that involves decoding written symbols to derive meaning. It requires coordination of visual processing, phonological awareness, and comprehension skills.';
            setScannedText(demoText);
            setLearningContent(demoText);
            setOcrMode('results');
          }},
        ]
      );
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const startLearning = async () => {
    if (!scannedText) {
      Alert.alert('Error', 'No text content available for learning.');
      return;
    }

    console.log('🎓 Navigating to Learn tab with new topic');
    // Reset camera state
    resetCamera();
    // Navigate to Learn tab
    (navigation as any).navigate('Learn');
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishLearning = () => {
    Alert.alert(
      '🎉 Learning Complete!',
      'Excellent work! You\'ve finished all the quiz questions. Now create a personalized AI teacher video to explain the content in detail with audio.',
      [
        {
          text: '🎬 Create AI Teacher Video',
          onPress: () => {
            console.log('✨ User selected: Create Avatar Video');
            startAvatarGeneration();
          },
          style: 'default',
        },
        {
          text: '📚 Review Questions',
          onPress: () => {
            console.log('📚 User selected: Review Questions');
            setCurrentQuestionIndex(0);
          },
          style: 'cancel',
        },
        {
          text: '🏠 Return to Dashboard',
          onPress: () => {
            console.log('🏠 User selected: Return to Dashboard');
            resetCamera();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const resetCamera = () => {
    setOcrMode('selection');
    setScannedText('');
    setVideoUrl(null);
    setProcessingMessage('');
    setTeachingPlan([]);
    setLearningContent('');
    setInputText('');
    setSelectedDocument(null);
    setQuizData([]);
    setCurrentQuestionIndex(0);
    setExtractedImages([]);
  };

  const processTextInput = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text first.');
      return;
    }

    setIsProcessing(true);
    setProcessingMessage('Generating personalized learning content...');
    Vibration.vibrate(100);

    try {
      console.log('🎓 Generating teaching plan from text input...');
      setScannedText(inputText);

      const teachingPlanResult = await ocrService.generateTeachingPlan(inputText);

      if (teachingPlanResult.success && teachingPlanResult.data) {
        console.log('✅ Teaching Plan Generated');
        setTeachingPlan(teachingPlanResult.data);

        // Format teaching plan for avatar
        const formattedContent = ocrService.formatTeachingPlanForAvatar(teachingPlanResult.data);
        setLearningContent(formattedContent);

        setOcrMode('results');
        Alert.alert(
          '✅ Content Processed!',
          `Successfully generated ${teachingPlanResult.data.length} personalized learning activities!`
        );
      } else {
        console.log('⚠️ Teaching plan generation failed, using input text');
        setLearningContent(inputText);
        setOcrMode('results');
        Alert.alert('✅ Text Processed!', 'Text processed successfully!');
      }

    } catch (error) {
      console.error('💥 Text Processing Error:', error);

      let errorMessage = 'Failed to process the text. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert('❌ Processing Failed', errorMessage);
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const processDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const document = result.assets[0];
      setSelectedDocument(document);
      setIsProcessing(true);
      setProcessingMessage('Summarizing document...');
      Vibration.vibrate(100);

      console.log('📄 Starting document summarization...');

      const summarizationResult = await ocrService.summarizeFile(document.uri);

      if (summarizationResult.success && summarizationResult.data) {
        console.log('✅ Document Summarized');
        setScannedText(summarizationResult.data);

        // Generate teaching plan from summary
        setProcessingMessage('Generating personalized learning content...');
        const teachingPlanResult = await ocrService.generateTeachingPlan(summarizationResult.data);

        if (teachingPlanResult.success && teachingPlanResult.data) {
          setTeachingPlan(teachingPlanResult.data);
          const formattedContent = ocrService.formatTeachingPlanForAvatar(teachingPlanResult.data);
          setLearningContent(formattedContent);
        } else {
          setLearningContent(summarizationResult.data);
        }

        setOcrMode('results');
        Alert.alert('✅ Document Processed!', 'Document has been summarized and learning content generated!');
      } else {
        Alert.alert('❌ Processing Failed', summarizationResult.message || 'Failed to process document.');
      }

    } catch (error) {
      console.error('💥 Document Upload Error:', error);
      Alert.alert('❌ Upload Failed', 'Failed to upload or process document. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingMessage('');
    }
  };

  const startAvatarGeneration = () => {
    setOcrMode('avatar_config');
  };

  const generateAvatarVideo = async () => {
    if (!learningContent) {
      Alert.alert('Error', 'No learning content available for avatar generation.');
      return;
    }

    setOcrMode('video_generation');
    setIsProcessing(true);
    setProcessingMessage('Generating your personalized learning video...');

    try {
      const request: AvatarTalkRequest = {
        text: avatarTalkService.truncateText(learningContent),
        avatar: selectedAvatar,
        emotion: selectedEmotion,
        language: selectedLanguage,
      };

      const response = await avatarTalkService.generateVideo(request);

      setVideoUrl(response.mp4_url);
      setOcrMode('learning');

      Vibration.vibrate(200);
      Alert.alert('✅ Video Generated!', 'Your personalized learning video is ready!');

    } catch (error) {
      console.error('Error generating avatar video:', error);
      Alert.alert('Generation Error', 'Failed to generate avatar video. Please try again.');
      setOcrMode('results');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={globalStyles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Selection Mode - Show 3 options
      if (ocrMode === 'selection') {
      return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                   <Text style={[globalStyles.h2, styles.headerTitle]}>📚 Learn Hub</Text>
         <Text style={[globalStyles.textSecondary, styles.headerSubtitle]}>Choose how you want to learn</Text>
          </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {/* Option 1: Take Picture (OCR) */}
          <TouchableOpacity style={styles.selectionCard} onPress={openCamera}>
            <View style={styles.selectionIconContainer}>
              <Ionicons name="camera-outline" size={48} color="#3DB2FF" />
            </View>
            <View style={styles.selectionContent}>
              <Text style={globalStyles.selectionTitle}>📸 Take Picture</Text>
              <Text style={globalStyles.selectionDescription}>
                Capture text from books, notes, or any document using your camera
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          {/* Option 2: Upload from Gallery */}
          <TouchableOpacity style={styles.selectionCard} onPress={openGallery}>
            <View style={styles.selectionIconContainer}>
              <Ionicons name="images-outline" size={48} color="#9C27B0" />
            </View>
            <View style={styles.selectionContent}>
              <Text style={styles.selectionTitle}>🖼️ Upload from Gallery</Text>
              <Text style={styles.selectionDescription}>
                Select an image from your gallery to extract text from
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          {/* Option 3: Write Text */}
          <TouchableOpacity style={styles.selectionCard} onPress={() => setOcrMode('text_input')}>
            <View style={styles.selectionIconContainer}>
              <Ionicons name="create-outline" size={48} color="#4CAF50" />
            </View>
            <View style={styles.selectionContent}>
              <Text style={styles.selectionTitle}>✍️ Write Text</Text>
              <Text style={styles.selectionDescription}>
                Type or paste text directly to create personalized learning content
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          {/* Option 4: Upload Document */}
          <TouchableOpacity style={styles.selectionCard} onPress={processDocumentUpload}>
            <View style={styles.selectionIconContainer}>
              <Ionicons name="document-outline" size={48} color="#FF9800" />
            </View>
            <View style={styles.selectionContent}>
              <Text style={styles.selectionTitle}>📄 Upload Document</Text>
              <Text style={styles.selectionDescription}>
                Upload PDF, Word, or other documents for automatic summarization
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Text Input Mode
  if (ocrMode === 'text_input') {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => setOcrMode('selection')}>
            <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>✍️ Write Text</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Enter your learning content:</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Type or paste your text here..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={[styles.processButton, !inputText.trim() && styles.processButtonDisabled]}
            onPress={processTextInput}
            disabled={!inputText.trim() || isProcessing}
          >
            {isProcessing ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.processButtonText}>Processing...</Text>
              </>
            ) : (
              <>
                <Ionicons name="bulb-outline" size={20} color="#FFFFFF" />
                <Text style={styles.processButtonText}>Generate Learning Plan</Text>
              </>
            )}
          </TouchableOpacity>

          {processingMessage && (
            <Text style={styles.processingText}>{processingMessage}</Text>
          )}
        </View>
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
          <TouchableOpacity style={styles.backButton} onPress={() => {
            setPhotoUri(null);
            setOcrMode('selection');
          }}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.cameraHeaderTitle}>
            {photoUri ? 'Selected Image' : 'Capture Text'}
          </Text>
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

        {/* Processing Overlay */}
        {isProcessing && (
          <View style={styles.processingOverlay}>
            <View style={styles.processingContent}>
              <ActivityIndicator size="large" color="#3DB2FF" />
              <Text style={styles.processingTitle}>Processing Image</Text>
              <Text style={styles.processingMessage}>{processingMessage}</Text>
              <View style={styles.processingSteps}>
                <Text style={styles.processingStepText}>🔍 Extracting text from image</Text>
                <Text style={styles.processingStepText}>🎓 Generating learning content</Text>
                <Text style={styles.processingStepText}>✨ Creating personalized activities</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.cameraButtonContainer}>
          {photoUri ? (
            <>
              <TouchableOpacity 
                style={[styles.cameraButton, styles.retakeButton]} 
                onPress={retakePhoto}
                disabled={isProcessing}
              >
                <Text style={styles.cameraButtonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.cameraButton, 
                  styles.cameraProcessButton,
                  isProcessing && styles.cameraProcessButtonDisabled
                ]} 
                onPress={processPhoto}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.cameraButtonText}>Processing...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="scan-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.cameraButtonText}>Process</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.galleryButton]} onPress={openGallery}>
                <Ionicons name="images" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
                <Ionicons name="camera" size={30} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  }

  // Learning Content Mode
  else if (ocrMode === 'learning_content') {
    const currentQuestion = quizData[currentQuestionIndex];

    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => setOcrMode('results')}>
            <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🎓 Learning Session</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Question {currentQuestionIndex + 1} of {quizData.length}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%` }]}
              />
            </View>
          </View>

          {/* Question Card */}
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>❓ {currentQuestion?.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion?.options?.map((option: string, index: number) => (
                <View key={index} style={styles.optionItem}>
                  <View style={styles.optionBullet}>
                    <Text style={styles.optionBulletText}>{String.fromCharCode(65 + index)}</Text>
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
                </View>
              ))}
            </View>

            <View style={styles.answerContainer}>
              <Text style={styles.answerLabel}>✅ Correct Answer:</Text>
              <Text style={styles.answerText}>{currentQuestion?.correct_answer}</Text>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.learningNavigation}>
            <TouchableOpacity
              style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
              onPress={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <Ionicons name="chevron-back" size={20} color={currentQuestionIndex === 0 ? '#CCCCCC' : '#3DB2FF'} />
              <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.navButtonTextDisabled]}>
                Previous
              </Text>
            </TouchableOpacity>

            {currentQuestionIndex === quizData.length - 1 ? (
              <TouchableOpacity style={styles.finishButton} onPress={finishLearning}>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.finishButtonText}>Finish Learning</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.navButton} onPress={nextQuestion}>
                <Text style={styles.navButtonText}>Next</Text>
                <Ionicons name="chevron-forward" size={20} color="#3DB2FF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Learning Tips */}
          <View style={styles.learningTips}>
            <Text style={styles.learningTipsTitle}>💡 Learning Tips</Text>
            <Text style={styles.learningTipsText}>
              • Take your time to understand each question{'\n'}
              • Review the correct answers to reinforce learning{'\n'}
              • Create connections between questions and your original text
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Avatar Configuration Mode
  else if (ocrMode === 'avatar_config') {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => setOcrMode('results')}>
            <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Your Teacher</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>👨‍🏫 Avatar Teacher</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScrollView}>
            {AVATAR_OPTIONS.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.optionCard,
                  selectedAvatar === avatar.id && styles.selectedOptionCard,
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
                  selectedEmotion === emotion.id && styles.selectedOptionCard,
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
                  selectedLanguage === language.id && styles.selectedOptionCard,
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
        </ScrollView>
      </View>
    );
  }

  // Video Generation Mode
  else if (ocrMode === 'video_generation') {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => setOcrMode('avatar_config')}>
            <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Generating Video</Text>
        </View>

        <View style={styles.processingContainer}>
          <Text style={styles.processingText}>{processingMessage}</Text>
          <Text style={styles.processingSubtext}>This may take a few moments...</Text>

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
  }

  // Learning Session Mode
  else if (ocrMode === 'learning') {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity style={styles.backButton} onPress={resetCamera}>
            <Ionicons name="refresh" size={24} color="#3DB2FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Learning Session</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {videoUrl && (
            <View style={styles.videoContainer}>
              <Text style={styles.sectionTitle}>🎬 Your Learning Video</Text>
              <Text style={styles.videoDescription}>
                Watch your personalized learning video with audio explanations
              </Text>
              <Video
                source={{ uri: videoUrl }}
                style={styles.video}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={false}
                isMuted={false}
                volume={1.0}
                rate={1.0}
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
              <Text style={styles.infoValue}>{scannedText.length} characters</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.secondaryButton} onPress={resetCamera}>
              <Ionicons name="add" size={20} color="#3DB2FF" />
              <Text style={styles.secondaryButtonText}>New Content</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={resetCamera}>
              <Ionicons name="home" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Back to Hub</Text>
            </TouchableOpacity>
          </View>

          {/* Completion Message */}
          <View style={styles.completionMessage}>
            <Text style={styles.completionTitle}>🎉 Learning Session Complete!</Text>
            <Text style={styles.completionText}>
              You've successfully completed your personalized learning experience. The AI teacher video above explains the content with audio narration.
            </Text>
            <View style={styles.nextSteps}>
              <Text style={styles.nextStepsTitle}>What's Next?</Text>
              <Text style={styles.nextStepsItem}>• Watch the video again if needed</Text>
              <Text style={styles.nextStepsItem}>• Create new content to learn more</Text>
              <Text style={styles.nextStepsItem}>• Return to dashboard for other activities</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  else if (ocrMode === 'results') {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.resultsHeader, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity style={styles.backButton} onPress={resetCamera}>
            <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
          </TouchableOpacity>
          <Text style={styles.resultsHeaderTitle}>Scanned Text</Text>
          <View style={{ width: 40 }} />
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

          {/* Extracted Images Gallery */}
          {extractedImages.length > 0 && (
            <View style={styles.imageGalleryContainer}>
              <Text style={styles.imageGalleryTitle}>
                🖼️ Extracted Images ({extractedImages.length})
              </Text>
              <Text style={styles.imageGalleryDescription}>
                Images found and extracted from the scanned document
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>
                {extractedImages.map((image, index) => (
                  <View key={index} style={styles.imageItem}>
                    <Image
                      source={{ uri: image.url }}
                      style={styles.extractedImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.imageLabel}>
                      Page {image.page + 1} • {image.type}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Learn Button */}
          <TouchableOpacity
            style={[styles.learnButton, isProcessing && styles.learnButtonDisabled]}
            onPress={startLearning}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.learnButtonText}>Generating...</Text>
              </>
            ) : (
              <>
                <Ionicons name="school" size={24} color="#FFFFFF" />
                <Text style={styles.learnButtonText}>Start Learning</Text>
              </>
            )}
          </TouchableOpacity>

          {processingMessage && (
            <Text style={styles.processingText}>{processingMessage}</Text>
          )}

          {/* Get Started Instructions */}
          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedTitle}>✨ Ready to Learn!</Text>
            <Text style={styles.getStartedDescription}>
              Click "Start Learning" to generate personalized quiz questions and learning activities based on your content.
            </Text>

            {/* Learning Preview */}
            <View style={styles.previewContainer}>
              <View style={styles.previewItem}>
                <Ionicons name="help-circle-outline" size={20} color="#4CAF50" />
                <Text style={styles.previewText}>Interactive quiz questions</Text>
              </View>
                             <View style={styles.previewItem}>
                 <Ionicons name="bulb-outline" size={20} color="#4CAF50" />
                 <Text style={styles.previewText}>Personalized explanations</Text>
               </View>
              <View style={styles.previewItem}>
                <Ionicons name="trophy-outline" size={20} color="#4CAF50" />
                <Text style={styles.previewText}>Progress tracking</Text>
              </View>
            </View>
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
              <Text style={styles.subtitle}>
                Point your camera at any text and our AI will help you learn and understand it better with personalized explanations.
              </Text>

                             <View style={styles.cameraOptionsContainer}>
                 <TouchableOpacity
                   style={styles.cameraOptionButton}
                   onPress={openCamera}
                 >
                   <Text style={styles.cameraOptionButtonText}>📸 Take Picture</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.cameraOptionButton}
                   onPress={openGallery}
                 >
                   <Text style={styles.cameraOptionButtonText}>🖼️ Upload from Gallery</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.cameraOptionButton}
                   onPress={() => setOcrMode('text_input')}
                 >
                   <Text style={styles.cameraOptionButtonText}>✍️ Write Text</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.cameraOptionButton}
                   onPress={processDocumentUpload}
                 >
                   <Text style={styles.cameraOptionButtonText}>📄 Upload Document</Text>
                 </TouchableOpacity>
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
    fontSize: 28,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  cameraOptionsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  cameraOptionButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 280,
    minHeight: 60,
    shadowColor: '#3DB2FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cameraOptionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
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
    paddingHorizontal: 10,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    minWidth: 100,
    minHeight: 80,
    marginHorizontal: 5,
    marginVertical: 5,
    flex: 1,
    maxWidth: 120,
    shadowColor: '#3DB2FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Bold',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 16,
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
    paddingBottom: 120,
  },
  resultsHeader: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsHeaderTitle: {
    fontSize: 20,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    flex: 1,
    textAlign: 'center',
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
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    gap: 20,
  },
  cameraButton: {
    backgroundColor: '#3DB2FF',
    padding: 20,
    borderRadius: 50,
    minWidth: 80,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3DB2FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  galleryButton: {
    backgroundColor: '#9C27B0',
    padding: 18,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    minHeight: 70,
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
  },
  retakeButton: {
    backgroundColor: '#FFA500',
  },
  cameraProcessButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    gap: 8,
  },
  cameraProcessButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  processingContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 300,
    marginHorizontal: 20,
  },
  processingTitle: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginTop: 15,
    marginBottom: 10,
  },
  processingMessage: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  processingSteps: {
    alignItems: 'flex-start',
  },
  processingStepText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#888888',
    marginBottom: 5,
  },
  // Selection screen styles
  selectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  selectionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  selectionContent: {
    flex: 1,
  },
  selectionTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 5,
  },
  selectionDescription: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  // Text input styles
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    borderWidth: 2,
    borderColor: '#E3F2FD',
    minHeight: 200,
    marginBottom: 20,
  },
  processButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  processButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  processButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 8,
  },
  // Avatar configuration styles
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 15,
    marginTop: 20,
  },
  optionsScrollView: {
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 2,
    borderColor: '#E3F2FD',
  },
  selectedOptionCard: {
    backgroundColor: '#E3F2FD',
    borderColor: '#3DB2FF',
  },
  optionEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  optionName: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    marginRight: 10,
  },
  // Video generation styles
  avatarPreview: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  avatarPreviewText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 5,
  },
  avatarPreviewEmotion: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
  },
  // Learning session styles
  videoContainer: {
    marginBottom: 30,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  sessionInfo: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#666666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
  },
  // Learn button styles
  learnButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  learnButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  learnButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 10,
  },
  // Action buttons for other screens
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3DB2FF',
    flex: 0.45,
  },
  secondaryButtonText: {
    color: '#3DB2FF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.45,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 8,
  },
  // Avatar styles for results screen
  avatarContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  avatarTitle: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  avatarDescription: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#2E7D32',
    marginBottom: 20,
    lineHeight: 24,
  },
  avatarButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 10,
  },
  // Learning content styles
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  questionText: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 20,
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  optionBullet: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3DB2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionBulletText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    flex: 1,
    lineHeight: 22,
  },
  answerContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  answerLabel: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  answerText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#2E7D32',
  },
  learningNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: '#3DB2FF',
    minWidth: 100,
    justifyContent: 'center',
  },
  navButtonDisabled: {
    borderColor: '#CCCCCC',
    backgroundColor: '#F5F5F5',
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    marginHorizontal: 5,
  },
  navButtonTextDisabled: {
    color: '#CCCCCC',
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    minWidth: 150,
    justifyContent: 'center',
  },
  finishButtonText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  learningTips: {
    backgroundColor: '#FFF3E0',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  learningTipsTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#E65100',
    marginBottom: 10,
  },
  learningTipsText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#E65100',
    lineHeight: 20,
  },
  // Get Started section styles
  getStartedContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  getStartedTitle: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#1976D2',
    marginBottom: 10,
    textAlign: 'center',
  },
  getStartedDescription: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#424242',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  previewContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#424242',
    marginLeft: 10,
  },
  videoDescription: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 15,
  },
  // Image gallery styles
  imageGalleryContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#E3F2FD',
  },
  imageGalleryTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 5,
  },
  imageGalleryDescription: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    marginBottom: 15,
  },
  imageScrollView: {
    paddingVertical: 5,
  },
  imageItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  extractedImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  imageLabel: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 120,
  },
  // Completion message styles
  completionMessage: {
    backgroundColor: '#E8F5E8',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  completionTitle: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  completionText: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#2E7D32',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  nextSteps: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  nextStepsItem: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#2E7D32',
    marginBottom: 4,
  },
});

export default CameraScreen;

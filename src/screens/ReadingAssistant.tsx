import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import ToastNotification from '../components/ToastNotification';
import { useToast } from '../hooks/useToast';

interface ReadingSettings {
  speechRate: number;
  pitch: number;
  volume: number;
  highlightWords: boolean;
  largeText: boolean;
  highContrast: boolean;
}

const ReadingAssistant = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState(route?.params?.text || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [readingSettings, setReadingSettings] = useState<ReadingSettings>({
    speechRate: 0.75,
    pitch: 1.0,
    volume: 1.0,
    highlightWords: true,
    largeText: false,
    highContrast: false,
  });
  
  // Toast notifications
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  // Sample texts for practice
  const sampleTexts = [
    {
      id: '1',
      title: 'Easy Reading',
      level: 'Beginner',
      text: 'The cat sits on the mat. The sun is bright today. Birds sing in the trees. Children play in the park.',
    },
    {
      id: '2',
      title: 'Weather Story',
      level: 'Intermediate',
      text: 'Today the weather is wonderful. The sun shines brightly in the clear blue sky. A gentle breeze moves through the green leaves of the trees.',
    },
    {
      id: '3',
      title: 'Adventure Tale',
      level: 'Advanced',
      text: 'Sarah discovered an ancient treasure map hidden in her grandmother\'s attic. The mysterious parchment revealed the location of a secret cave filled with precious gems.',
    },
  ];

  useEffect(() => {
    return () => {
      // Cleanup: stop speech when component unmounts
      Speech.stop();
    };
  }, []);

  const handlePlayPause = async () => {
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
      setCurrentWordIndex(-1);
    } else {
      if (!text.trim()) {
        showError('Please enter some text to read aloud.');
        return;
      }
      
      setIsPlaying(true);
      const words = text.split(' ');
      
      // Read with word highlighting if enabled
      if (readingSettings.highlightWords) {
        for (let i = 0; i < words.length; i++) {
          setCurrentWordIndex(i);
          
          try {
            await Speech.speak(words[i], {
              rate: readingSettings.speechRate,
              pitch: readingSettings.pitch,
              volume: readingSettings.volume,
            });
            
            // Small pause between words
            await new Promise<void>(resolve => setTimeout(() => resolve(), 200));
          } catch (error) {
            console.error('Speech error:', error);
            break;
          }
        }
      } else {
        // Read entire text at once
        Speech.speak(text, {
          rate: readingSettings.speechRate,
          pitch: readingSettings.pitch,
          volume: readingSettings.volume,
          onDone: () => {
            setIsPlaying(false);
            setCurrentWordIndex(-1);
          },
          onError: () => {
            setIsPlaying(false);
            setCurrentWordIndex(-1);
          },
        });
      }
      
      if (readingSettings.highlightWords) {
        setIsPlaying(false);
        setCurrentWordIndex(-1);
      }
    }
  };

  const handleSettingChange = (setting: keyof ReadingSettings, value: any) => {
    setReadingSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSampleTextSelect = (sampleText: any) => {
    setText(sampleText.text);
    showSuccess(`📚 "${sampleText.title}" loaded into reading assistant.`);
  };

  const getWordStyle = (index: number) => {
    if (currentWordIndex === index && readingSettings.highlightWords) {
      return [
        styles.word,
        styles.highlightedWord,
        readingSettings.largeText && styles.largeText,
        readingSettings.highContrast && styles.highContrastText,
      ];
    }
    return [
      styles.word,
      readingSettings.largeText && styles.largeText,
      readingSettings.highContrast && styles.highContrastText,
    ];
  };

  const renderTextWithHighlighting = () => {
    const words = text.split(' ');
    return (
      <View style={styles.textContainer}>
        {words.map((word: string, index: number) => (
          <Text key={index} style={getWordStyle(index)}>
            {word}{' '}
          </Text>
        ))}
      </View>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView 
      style={[
        styles.container,
        readingSettings.highContrast && styles.highContrastBackground
      ]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📖 Reading Assistant</Text>
        <TouchableOpacity 
          style={styles.cameraButton} 
          onPress={() => navigation.navigate('Camera')}
        >
          <Ionicons name="camera" size={24} color="#3DB2FF" />
        </TouchableOpacity>
      </View>

      {/* Sample Texts */}
      <View style={styles.sampleTextsContainer}>
        <Text style={styles.sectionTitle}>📚 Practice Texts</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sampleTexts.map((sample) => (
            <TouchableOpacity
              key={sample.id}
              style={styles.sampleTextCard}
              onPress={() => handleSampleTextSelect(sample)}
            >
              <Text style={styles.sampleTextTitle}>{sample.title}</Text>
              <Text style={styles.sampleTextLevel}>{sample.level}</Text>
              <Text style={styles.sampleTextPreview}>
                {sample.text.substring(0, 50)}...
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Text Input Area */}
      <View style={styles.inputContainer}>
        <Text style={styles.sectionTitle}>✍️ Your Text</Text>
        <TextInput
          style={[
            styles.textInput,
            readingSettings.largeText && styles.largeTextInput,
            readingSettings.highContrast && styles.highContrastInput,
          ]}
          multiline
          numberOfLines={8}
          value={text}
          onChangeText={setText}
          placeholder="Type or paste text here, or use the camera to scan text..."
          placeholderTextColor="#999999"
          textAlignVertical="top"
        />
      </View>

      {/* Reading Display */}
      {text.trim() && (
        <View style={styles.readingContainer}>
          <Text style={styles.sectionTitle}>📖 Reading View</Text>
          <View style={[
            styles.readingDisplay,
            readingSettings.highContrast && styles.highContrastDisplay,
          ]}>
            {renderTextWithHighlighting()}
          </View>
        </View>
      )}

      {/* Playback Controls */}
      <View style={styles.controlsContainer}>
        <Text style={styles.sectionTitle}>🎛️ Reading Controls</Text>
        
        <View style={styles.playbackControls}>
          <TouchableOpacity
            style={[styles.playButton, isPlaying && styles.playButtonActive]}
            onPress={handlePlayPause}
            disabled={!text.trim()}
          >
            <Ionicons 
              name={isPlaying ? 'pause' : 'play'} 
              size={32} 
              color={text.trim() ? '#FFFFFF' : '#CCCCCC'} 
            />
            <Text style={[
              styles.playButtonText,
              !text.trim() && styles.disabledText
            ]}>
              {isPlaying ? 'Pause' : 'Read Aloud'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reading Settings */}
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>🔧 Reading Settings</Text>
          
          {/* Speech Rate */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>🐌 Reading Speed: {Math.round(readingSettings.speechRate * 100)}%</Text>
            <View style={styles.sliderContainer}>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => handleSettingChange('speechRate', Math.max(0.1, readingSettings.speechRate - 0.1))}
              >
                <Ionicons name="remove" size={20} color="#3DB2FF" />
              </TouchableOpacity>
              <View style={styles.sliderTrack}>
                <View 
                  style={[
                    styles.sliderFill, 
                    { width: `${readingSettings.speechRate * 100}%` }
                  ]} 
                />
              </View>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => handleSettingChange('speechRate', Math.min(2.0, readingSettings.speechRate + 0.1))}
              >
                <Ionicons name="add" size={20} color="#3DB2FF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Toggle Settings */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>✨ Highlight Words</Text>
            <Switch
              value={readingSettings.highlightWords}
              onValueChange={(value) => handleSettingChange('highlightWords', value)}
              trackColor={{ false: '#E0E0E0', true: '#3DB2FF' }}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>🔍 Large Text</Text>
            <Switch
              value={readingSettings.largeText}
              onValueChange={(value) => handleSettingChange('largeText', value)}
              trackColor={{ false: '#E0E0E0', true: '#3DB2FF' }}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>🎨 High Contrast</Text>
            <Switch
              value={readingSettings.highContrast}
              onValueChange={(value) => handleSettingChange('highContrast', value)}
              trackColor={{ false: '#E0E0E0', true: '#3DB2FF' }}
            />
          </View>
        </View>
      </View>

      {/* Reading Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.sectionTitle}>💡 Reading Tips</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={20} color="#FFC107" />
          <Text style={styles.tipText}>
            Use the camera button to scan text from books, documents, or signs
          </Text>
        </View>
        <View style={styles.tipCard}>
          <Ionicons name="headset" size={20} color="#4CAF50" />
          <Text style={styles.tipText}>
            Use headphones for the best audio experience
          </Text>
        </View>
        <View style={styles.tipCard}>
          <Ionicons name="time" size={20} color="#2196F3" />
          <Text style={styles.tipText}>
            Take breaks every 10-15 minutes to rest your eyes
          </Text>
        </View>
      </View>
      
      {/* Toast Notification */}
      <ToastNotification
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  highContrastBackground: {
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  cameraButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sampleTextsContainer: {
    marginBottom: 25,
  },
  sampleTextCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 10,
    width: 200,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  sampleTextTitle: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  sampleTextLevel: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  sampleTextPreview: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    lineHeight: 16,
  },
  inputContainer: {
    marginBottom: 25,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    lineHeight: 24,
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  largeTextInput: {
    fontSize: 20,
    lineHeight: 28,
  },
  highContrastInput: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  readingContainer: {
    marginBottom: 25,
  },
  readingDisplay: {
    backgroundColor: '#FFFEF7',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    minHeight: 100,
    borderWidth: 2,
    borderColor: '#FFF9C4',
  },
  highContrastDisplay: {
    backgroundColor: '#000000',
    borderColor: '#FFFFFF',
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  word: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    lineHeight: 28,
  },
  highlightedWord: {
    backgroundColor: '#FFEB3B',
    color: '#000000',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  largeText: {
    fontSize: 22,
    lineHeight: 32,
  },
  highContrastText: {
    color: '#FFFFFF',
  },
  controlsContainer: {
    marginBottom: 25,
  },
  playbackControls: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#3DB2FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 10,
  },
  disabledText: {
    color: '#CCCCCC',
  },
  settingsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
  },
  settingsTitle: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    flex: 1,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  sliderButton: {
    padding: 5,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginHorizontal: 10,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#3DB2FF',
    borderRadius: 2,
  },
  tipsContainer: {
    marginBottom: 40,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
});

export default ReadingAssistant; 
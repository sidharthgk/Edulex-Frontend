import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CameraScreen = () => {
  const insets = useSafeAreaInsets();
  
  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 100 }}>Loading...</Text>
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
      <View style={styles.content}>
        <View style={styles.cameraCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="camera-outline" size={80} color="#3DB2FF" />
          </View>
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
          </View>

          <TouchableOpacity style={styles.startButton}>
            <Ionicons name="camera" size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Open Camera</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: 20,
    justifyContent: 'center',
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
});

export default CameraScreen; 
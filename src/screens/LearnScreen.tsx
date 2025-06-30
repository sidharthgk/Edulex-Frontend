import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const LearnScreen = () => {
  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learn</Text>
        <Text style={styles.headerSubtitle}>Discover interactive lessons tailored for you</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.comingSoonCard}>
          <Ionicons name="book-outline" size={60} color="#3DB2FF" />
          <Text style={styles.comingSoonTitle}>Learning Modules</Text>
          <Text style={styles.comingSoonText}>
            Interactive lessons and personalized learning paths are coming soon!
          </Text>
          <TouchableOpacity style={styles.notifyButton}>
            <Text style={styles.notifyButtonText}>Notify Me</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
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
  comingSoonCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  comingSoonTitle: {
    fontSize: 22,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginTop: 20,
    marginBottom: 15,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  notifyButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  notifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default LearnScreen; 
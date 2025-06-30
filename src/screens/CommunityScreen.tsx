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

const CommunityScreen = () => {
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
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Connect with fellow learners and mentors</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.communityCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="people-outline" size={80} color="#3DB2FF" />
          </View>
          <Text style={styles.title}>Join Our Learning Community</Text>
          <Text style={styles.description}>
            Connect with other learners, share experiences, and get support from mentors and peers who understand your journey.
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="chatbubbles-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Group Discussions</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="trophy-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Achievement Sharing</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="heart-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Peer Support</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="school-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Mentor Guidance</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Coming Soon</Text>
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
  communityCard: {
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
  joinButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  joinButtonText: {
    color: '#888888',
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default CommunityScreen; 
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const Dashboard = ({ navigation }: any) => {
  const [hasCompletedAssessment, _setHasCompletedAssessment] = useState(false); // Hardcoded for now
  const insets = useSafeAreaInsets();

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleTakeAssessment = () => {
    navigation.navigate('DyslexiaTestStart');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Section */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.titleText}>EDULEX AI</Text>
        <Text style={styles.subtitleText}>Your personalized learning companion</Text>
      </View>

      {/* Assessment Section */}
      {!hasCompletedAssessment && (
        <View style={styles.assessmentCard}>
          <View style={styles.assessmentHeader}>
            <Ionicons name="analytics-outline" size={24} color="#3DB2FF" />
            <Text style={styles.assessmentTitle}>Take Your Assessment</Text>
          </View>
          <Text style={styles.assessmentDescription}>
            Help us create a personalized learning path tailored to your needs. This assessment will help identify your strengths and areas for improvement.
          </Text>
          <TouchableOpacity style={styles.assessmentButton} onPress={handleTakeAssessment}>
            <Text style={styles.assessmentButtonText}>Start Assessment</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Progress Section */}
      {hasCompletedAssessment && (
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>85%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>
        </View>
      )}

      {/* Today's Focus */}
      <View style={styles.focusContainer}>
        <Text style={styles.sectionTitle}>Today's Focus</Text>
        
        <View style={styles.focusCard}>
          <View style={styles.focusIcon}>
            <Ionicons name="golf-outline" size={32} color="#3DB2FF" />
          </View>
          <View style={styles.focusContent}>
            <Text style={styles.focusTitle}>Reading Practice</Text>
            <Text style={styles.focusDescription}>
              Complete 10 minutes of reading exercises to improve your skills
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentActivityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Completed Phonics Lesson</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="trophy" size={20} color="#FFD700" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Earned Reading Badge</Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons name="camera" size={20} color="#3DB2FF" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Used OCR Learning Tool</Text>
            <Text style={styles.activityTime}>3 days ago</Text>
          </View>
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
  scrollContent: {
    paddingBottom: 120, // Add space for tab bar
  },
  header: {
    alignItems: 'center',
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 5,
  },
  titleText: {
    fontSize: 32,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 16,
    color: '#888888',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
  },
  assessmentCard: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3DB2FF',
  },
  assessmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  assessmentTitle: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginLeft: 10,
  },
  assessmentDescription: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    lineHeight: 24,
    marginBottom: 15,
  },
  assessmentButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'flex-start',
  },
  assessmentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
  },
  progressCard: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
  },
  progressTitle: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    marginTop: 5,
  },
  focusContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 15,
  },
  focusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  focusIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  focusContent: {
    flex: 1,
  },
  focusTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 5,
  },
  focusDescription: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  recentActivityContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#888888',
  },
});

export default Dashboard; 
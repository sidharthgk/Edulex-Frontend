import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import authService, { UserDetails } from '../services/authService';



const Dashboard = ({ navigation }: any) => {
  const [_hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // User details and dyslexia profile state
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const insets = useSafeAreaInsets();

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });



  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await authService.getUserDetails();
      setUserDetails(details);
      
      // Set assessment completion status based on dyslexia profile
      if (details.dyslexia_profile) {
        setHasCompletedAssessment(true);
      }
    } catch (err: any) {
      console.error('Error fetching user details:', err);
      setError(err.message || 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Animate welcome message
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // Fetch user details on component mount
    fetchUserDetails();
  }, [fadeAnim]);

  const handleTakeAssessment = () => {
    navigation.navigate('DyslexiaTestStart');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'reading_assistant':
        navigation.navigate('ReadingAssistant');
        break;
      case 'vocabulary':
        navigation.navigate('VocabularyBuilder');
        break;
      case 'camera':
        navigation.navigate('Camera');
        break;
      case 'analytics':
        navigation.navigate('Dashboard'); // Navigate to analytics when implemented
        break;
      default:
        navigation.navigate('Learn');
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Section */}
      <Animated.View style={[styles.header, { paddingTop: insets.top + 20, opacity: fadeAnim }]}>
        <Text style={styles.welcomeText}>Welcome back{userDetails ? `, ${userDetails.name}` : ''}!</Text>
        <Text style={styles.titleText}>EDULEX AI</Text>
        <Text style={styles.subtitleText}>Your personalized learning companion</Text>
      </Animated.View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3DB2FF" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={32} color="#F44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUserDetails}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Assessment Prompt for users without profile */}
      {!loading && userDetails && !userDetails.dyslexia_profile && (
        <View style={styles.assessmentPrompt}>
          <Ionicons name="school" size={48} color="#3DB2FF" />
          <Text style={styles.assessmentTitle}>Complete Your Assessment</Text>
          <Text style={styles.assessmentDescription}>
            Take our simple assessment to get personalized learning recommendations
          </Text>
          <TouchableOpacity style={styles.promptAssessmentButton} onPress={handleTakeAssessment}>
            <Text style={styles.promptAssessmentButtonText}>Start Assessment</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Learning Tools - Always show */}
      {!loading && userDetails && (
        <View style={styles.enhancedToolsContainer}>
          <Text style={styles.sectionTitle}>🚀 Learning Tools</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity
              style={styles.toolCard}
              onPress={() => handleQuickAction('reading_assistant')}
            >
              <Ionicons name="volume-high" size={32} color="#4CAF50" />
              <Text style={styles.toolTitle}>Reading Assistant</Text>
              <Text style={styles.toolDescription}>Text-to-speech with highlighting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolCard}
              onPress={() => handleQuickAction('vocabulary')}
            >
              <Ionicons name="book" size={32} color="#2196F3" />
              <Text style={styles.toolTitle}>Vocabulary Builder</Text>
              <Text style={styles.toolDescription}>Learn words with pronunciation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolCard}
              onPress={() => handleQuickAction('camera')}
            >
              <Ionicons name="camera" size={32} color="#FF9800" />
              <Text style={styles.toolTitle}>Smart Scanner</Text>
              <Text style={styles.toolDescription}>AI-powered text recognition</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolCard}
              onPress={() => handleQuickAction('analytics')}
            >
              <Ionicons name="analytics" size={32} color="#9C27B0" />
              <Text style={styles.toolTitle}>Progress Analytics</Text>
              <Text style={styles.toolDescription}>Track your improvements</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Minigames Section - New addition */}
      {!loading && userDetails && (
        <View style={styles.enhancedToolsContainer}>
          <Text style={styles.sectionTitle}>🎮 Learning Games</Text>
          <Text style={styles.sectionSubtitle}>Fun games designed for dyslexic learners</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity
              style={[styles.toolCard, styles.gameCard]}
              onPress={() => navigation.navigate('RhymingPairsGame')}
            >
              <Ionicons name="musical-notes" size={32} color="#E91E63" />
              <Text style={styles.toolTitle}>Rhyming Pairs</Text>
              <Text style={styles.toolDescription}>Match words that sound alike</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolCard, styles.gameCard]}
              onPress={() => navigation.navigate('LetterFlippingGame')}
            >
              <Ionicons name="build" size={32} color="#FF5722" />
              <Text style={styles.toolTitle}>Word Builder</Text>
              <Text style={styles.toolDescription}>Spell words from emoji clues</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolCard, styles.gameCard]}
              onPress={() => navigation.navigate('SyllableCountingGame')}
            >
              <Ionicons name="mic" size={32} color="#00BCD4" />
              <Text style={styles.toolTitle}>Syllable Counter</Text>
              <Text style={styles.toolDescription}>Count word parts and sounds</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolCard, styles.gameCard]}
              onPress={() => navigation.navigate('PatternRecognitionGame')}
            >
              <Ionicons name="eye" size={32} color="#795548" />
              <Text style={styles.toolTitle}>Pattern Master</Text>
              <Text style={styles.toolDescription}>Complete visual sequences</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    paddingHorizontal: 20,
  },
  streakCard: {
    backgroundColor: '#FFF8E1',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  streakInfo: {
    flex: 1,
    marginLeft: 15,
  },
  streakNumber: {
    fontSize: 28,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#F57C00',
  },
  streakLabel: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#F57C00',
  },
  practiceButton: {
    backgroundColor: '#FFC107',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceButtonText: {
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    fontSize: 16,
  },
  streakDescription: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#E65100',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'left',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    marginBottom: 15,
    textAlign: 'left',
    lineHeight: 22,
  },
  goalsContainer: {
    marginBottom: 25,
  },
  goalCard: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 15,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginLeft: 10,
    flex: 1,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    minWidth: 60,
  },
  quickActionsContainer: {
    marginBottom: 25,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
    marginVertical: 5,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginTop: 8,
    textAlign: 'center',
  },
  recommendationsContainer: {
    marginBottom: 25,
  },
  recommendationCard: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 5,
  },
  recommendationDescription: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
  },
  recommendationAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#3DB2FF',
    marginRight: 5,
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
    backgroundColor: '#E8F5E8',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
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
    color: '#4CAF50',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#2E7D32',
    fontFamily: 'OpenDyslexic-Regular',
  },
  recentActivityContainer: {
    marginBottom: 30,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  activityIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 5,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'OpenDyslexic-Regular',
  },
  achievementsContainer: {
    marginBottom: 30,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  lockedText: {
    color: '#BDBDBD',
  },
  quickActionGames: {
    backgroundColor: '#E3F2FD',
  },
  quickActionCamera: {
    backgroundColor: '#E8F5E8',
  },
  quickActionQuiz: {
    backgroundColor: '#FCE4EC',
  },
  quickActionCommunity: {
    backgroundColor: '#FFF3E0',
  },
  quickActionAssessment: {
    backgroundColor: '#F3E5F5',
  },
  lockedAchievementIcon: {
    backgroundColor: '#E0E0E0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },

  difficultyContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: '#F0F8FF',
    borderRadius: 15,
    padding: 20,
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  difficultyButton: {
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  difficultyButtonActive: {
    backgroundColor: '#E3F2FD',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#666666',
    textAlign: 'center',
  },
  difficultyDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  accessibilityContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: '#E8F5E8',
    borderRadius: 15,
    padding: 20,
  },
  accessibilityGrid: {
    gap: 15,
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  accessibilityLabel: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
    marginLeft: 10,
    flex: 1,
  },
  enhancedToolsContainer: {
    marginHorizontal: 20,
    marginBottom: 30, // Increased margin for tab bar space
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15, // Consistent gap between cards
  },
  toolCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '47%', // Responsive width for 2 columns
    minHeight: 140, // Consistent height for all cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  toolTitle: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
  },
  gameCard: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E8E8E8',
    borderWidth: 2,
  },
  
  // Loading state styles
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginHorizontal: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    marginBottom: 25,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  
  // Error state styles
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginHorizontal: 20,
    backgroundColor: '#FFEBEE',
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: '#D32F2F',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#F44336',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
  },
  
  // Profile container styles
  profileContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#666666',
    marginBottom: 3,
  },
  profileAge: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#888888',
  },
  
  // Wallet section styles
  walletSection: {
    marginBottom: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
    padding: 15,
  },
  walletBalance: {
    marginLeft: 12,
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#4CAF50',
  },
  
  // Assessment section styles
  assessmentSection: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  profileAssessmentTitle: {
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
  },
  reportSection: {
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  reportTitle: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  reportText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    lineHeight: 20,
  },
  promptsSection: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 15,
  },
  promptsTitle: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#FF9800',
    marginBottom: 10,
  },
  promptsText: {
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    lineHeight: 20,
  },
  
  // Assessment prompt styles (for users without profile)
  assessmentPrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginHorizontal: 20,
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#3DB2FF',
    borderStyle: 'dashed',
  },
  promptAssessmentButton: {
    backgroundColor: '#3DB2FF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 15,
  },
  promptAssessmentButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenDyslexic-Bold',
  },
  
  // Retake assessment styles
  retakePrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFF3E0',
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  retakeTitle: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#F57F17',
    marginVertical: 10,
    textAlign: 'center',
  },
  retakeButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 5,
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default Dashboard;

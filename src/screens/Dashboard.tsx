import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Vibration,
  Animated,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DailyGoal {
  id: string;
  title: string;
  progress: number;
  target: number;
  unit: string;
  icon: string;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

const Dashboard = ({ navigation }: any) => {
  const [hasCompletedAssessment, _setHasCompletedAssessment] = useState(false); // Hardcoded for now
  const [currentStreak, setCurrentStreak] = useState(5);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  // Daily goals data
  const dailyGoals: DailyGoal[] = [
    { id: '1', title: 'Reading Practice', progress: 8, target: 10, unit: 'minutes', icon: 'book', color: '#4CAF50' },
    { id: '2', title: 'Games Played', progress: 2, target: 3, unit: 'games', icon: 'game-controller', color: '#2196F3' },
    { id: '3', title: 'AI Quizzes', progress: 0, target: 1, unit: 'quiz', icon: 'school', color: '#E91E63' },
    { id: '4', title: 'Words Learned', progress: 5, target: 8, unit: 'words', icon: 'text', color: '#FF9800' },
    { id: '5', title: 'OCR Scans', progress: 1, target: 2, unit: 'scans', icon: 'camera', color: '#9C27B0' },
  ];

  // All achievements
  const achievements: Achievement[] = [
    { id: '1', title: 'First Steps', description: 'Complete your first lesson', icon: 'footsteps', color: '#4CAF50', unlocked: true },
    { id: '2', title: 'Word Master', description: 'Score 100 points in word games', icon: 'book', color: '#2196F3', unlocked: true },
    { id: '3', title: 'Reading Streak', description: 'Practice for 7 days in a row', icon: 'flame', color: '#FF9800', unlocked: true },
    { id: '4', title: 'Letter Legend', description: 'Master 50 letter recognition exercises', icon: 'text', color: '#9C27B0', unlocked: false },
    { id: '5', title: 'Reading Champion', description: 'Read 1000 words with OCR camera', icon: 'camera', color: '#F44336', unlocked: false },
    { id: '6', title: 'Community Helper', description: 'Help 10 fellow learners', icon: 'heart', color: '#E91E63', unlocked: false },
  ];

  // Recent achievements for display
  const recentAchievements = achievements.filter(a => a.unlocked).slice(0, 3);

  // Learning recommendations
  const recommendations = [
    { id: '1', title: 'Try AI Learning Quiz', description: 'Take a photo of text and learn with an AI avatar teacher', action: 'Start Quiz', target: 'quiz' },
    { id: '2', title: 'Practice Letter Recognition', description: 'Focus on confusing letters like b/d and p/q', action: 'Start Game', target: 'letters' },
    { id: '3', title: 'Try OCR Camera', description: 'Scan text from your environment to practice reading', action: 'Open Camera', target: 'camera' },
    { id: '4', title: 'Join Community', description: 'Connect with other learners for support', action: 'Explore', target: 'community' },
  ];

     useEffect(() => {
     // Animate welcome message
     Animated.timing(fadeAnim, {
       toValue: 1,
       duration: 1000,
       useNativeDriver: true,
     }).start();

     // Set random motivational message
     const motivationalMessages = [
       "Great job! You're making amazing progress! 🌟",
       'Every small step counts. Keep going! 💪',
       "You're building stronger reading skills each day! 📚",
       'Your dedication is inspiring! 🚀',
       "Practice makes progress, and you're doing great! ✨",
     ];
     const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
     setMotivationalMessage(randomMessage);
   }, [fadeAnim]);

  const handleTakeAssessment = () => {
    navigation.navigate('DyslexiaTestStart');
  };

  const handleGoalTap = (goal: DailyGoal) => {
    if (goal.progress >= goal.target) {
      Vibration.vibrate(100);
      Alert.alert('🎉 Goal Completed!', `Congratulations! You've reached your ${goal.title.toLowerCase()} goal for today!`);
    } else {
      Alert.alert('💪 Keep Going!', `You're ${goal.target - goal.progress} ${goal.unit} away from completing your ${goal.title.toLowerCase()} goal.`);
    }
  };

  const handleStreakTap = () => {
    Alert.alert('🔥 Learning Streak', `You've been practicing for ${currentStreak} days in a row! \n\nKeep it up to unlock special rewards:\n• 7 days: Bronze Badge\n• 14 days: Silver Badge\n• 30 days: Gold Badge`);
  };

  const handleRecommendationTap = (recommendation: any) => {
    if (recommendation.target === 'letters') {
      navigation.navigate('Learn');
    } else if (recommendation.target === 'camera') {
      navigation.navigate('Camera');
    } else if (recommendation.target === 'community') {
      navigation.navigate('Community');
    } else if (recommendation.target === 'quiz') {
      navigation.navigate('Quiz');
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'games':
        navigation.navigate('Learn');
        break;
      case 'camera':
        navigation.navigate('Camera');
        break;
      case 'community':
        navigation.navigate('Community');
        break;
      case 'quiz':
        navigation.navigate('Quiz');
        break;
      case 'practice':
        setCurrentStreak(currentStreak + 1);
        Vibration.vibrate(100);
        Alert.alert('✅ Practice Logged!', 'Great job on your practice session today!');
        break;
    }
  };

  const getProgressBarWidth = (progress: number, target: number): number => {
    return Math.min((progress / target) * 100, 100);
  };

  const getStreakIcon = (streak: number): any => {
    if (streak >= 30) {return 'flame';}
    if (streak >= 14) {return 'flame-outline';}
    if (streak >= 7) {return 'bonfire-outline';}
    return 'sunny-outline';
  };

  const getStreakColor = (streak: number): string => {
    if (streak >= 30) {return '#FF4444';}
    if (streak >= 14) {return '#FF8800';}
    if (streak >= 7) {return '#FFAA00';}
    return '#FFC107';
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Section */}
      <Animated.View style={[styles.header, { paddingTop: insets.top + 20, opacity: fadeAnim }]}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.titleText}>EDULEX AI</Text>
        <Text style={styles.subtitleText}>{motivationalMessage}</Text>
      </Animated.View>

      {/* Streak Card */}
      <TouchableOpacity style={styles.streakCard} onPress={handleStreakTap}>
        <View style={styles.streakHeader}>
          <Ionicons name={getStreakIcon(currentStreak)} size={32} color={getStreakColor(currentStreak)} />
          <View style={styles.streakInfo}>
            <Text style={styles.streakNumber}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
          <TouchableOpacity
            style={styles.practiceButton}
            onPress={() => handleQuickAction('practice')}
          >
            <Text style={styles.practiceButtonText}>+1</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.streakDescription}>You're on fire! Keep practicing daily.</Text>
      </TouchableOpacity>

      {/* Daily Goals */}
      <View style={styles.goalsContainer}>
        <Text style={styles.sectionTitle}>Today's Goals</Text>
        {dailyGoals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={styles.goalCard}
            onPress={() => handleGoalTap(goal)}
          >
            <View style={styles.goalHeader}>
              <Ionicons name={goal.icon as any} size={24} color={goal.color} />
              <Text style={styles.goalTitle}>{goal.title}</Text>
              {goal.progress >= goal.target && (
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              )}
            </View>
            <View style={styles.goalProgress}>
              <View style={styles.progressBar}>
                                 <View
                   style={[
                     styles.progressFill,
                     {
                       width: `${getProgressBarWidth(goal.progress, goal.target)}%`,
                       backgroundColor: goal.color,
                     },
                   ]}
                 />
              </View>
              <Text style={styles.progressText}>{goal.progress}/{goal.target} {goal.unit}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={[styles.quickActionCard, styles.quickActionGames]}
            onPress={() => handleQuickAction('games')}
          >
            <Ionicons name="game-controller" size={32} color="#2196F3" />
            <Text style={styles.quickActionText}>Play Games</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, styles.quickActionCamera]}
            onPress={() => handleQuickAction('camera')}
          >
            <Ionicons name="camera" size={32} color="#4CAF50" />
            <Text style={styles.quickActionText}>Scan Text</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, styles.quickActionQuiz]}
            onPress={() => handleQuickAction('quiz')}
          >
            <Ionicons name="school" size={32} color="#E91E63" />
            <Text style={styles.quickActionText}>AI Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, styles.quickActionCommunity]}
            onPress={() => handleQuickAction('community')}
          >
            <Ionicons name="people" size={32} color="#FF9800" />
            <Text style={styles.quickActionText}>Community</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, styles.quickActionAssessment]}
            onPress={handleTakeAssessment}
          >
            <Ionicons name="analytics" size={32} color="#9C27B0" />
            <Text style={styles.quickActionText}>Assessment</Text>
          </TouchableOpacity>
        </View>
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

      {/* Learning Recommendations */}
      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        {recommendations.map((rec) => (
          <TouchableOpacity
            key={rec.id}
            style={styles.recommendationCard}
            onPress={() => handleRecommendationTap(rec)}
          >
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>{rec.title}</Text>
              <Text style={styles.recommendationDescription}>{rec.description}</Text>
            </View>
            <View style={styles.recommendationAction}>
              <Text style={styles.actionButtonText}>{rec.action}</Text>
              <Ionicons name="arrow-forward" size={16} color="#3DB2FF" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

              {/* Recent Achievements */}
        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>

          {recentAchievements.map((achievement, index) => (
            <View key={achievement.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: achievement.color }]}>
                <Ionicons name={achievement.icon as any} size={20} color="#FFFFFF" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{achievement.title}</Text>
                <Text style={styles.activityDescription}>{achievement.description}</Text>
                <Text style={styles.activityTime}>
                  {index === 0 ? '2 hours ago' : index === 1 ? '1 day ago' : '3 days ago'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* All Achievements Section */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>All Achievements</Text>
          <Text style={styles.sectionSubtitle}>Unlock badges by completing challenges</Text>

          {achievements.map((achievement) => (
            <View key={achievement.id} style={[styles.achievementCard, !achievement.unlocked && styles.lockedAchievement]}>
              <View style={[
                styles.achievementIcon,
                achievement.unlocked ? { backgroundColor: achievement.color } : styles.lockedAchievementIcon,
              ]}>
                <Ionicons name={achievement.icon as any} size={24} color={achievement.unlocked ? '#FFFFFF' : '#BDBDBD'} />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementTitle, !achievement.unlocked && styles.lockedText]}>{achievement.title}</Text>
                <Text style={[styles.achievementDescription, !achievement.unlocked && styles.lockedText]}>{achievement.description}</Text>
              </View>
              {achievement.unlocked && (
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              )}
            </View>
          ))}
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
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    color: '#333333',
    marginBottom: 15,
    paddingHorizontal: 20,
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
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 15,
    paddingHorizontal: 20,
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
});

export default Dashboard;

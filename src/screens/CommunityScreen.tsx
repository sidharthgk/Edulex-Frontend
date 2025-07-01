import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ToastNotification from '../components/ToastNotification';
import { useToast } from '../hooks/useToast';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  badge?: string;
}

interface Discussion {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  topic: string;
}

const CommunityScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'discussions'>('overview');
  
  // Toast notifications
  const { toast, showInfo, hideToast } = useToast();

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  // Sample data that would come from backend

  const leaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'Emma Chen', score: 2450, rank: 1, badge: '👑' },
    { id: '2', name: 'You (Alex)', score: 1890, rank: 2, badge: '🥈' },
    { id: '3', name: 'Marcus Brown', score: 1756, rank: 3, badge: '🥉' },
    { id: '4', name: 'Sophia Lee', score: 1623, rank: 4 },
    { id: '5', name: 'James Wilson', score: 1598, rank: 5 },
    { id: '6', name: 'Olivia Davis', score: 1434, rank: 6 },
    { id: '7', name: 'Noah Garcia', score: 1378, rank: 7 },
    { id: '8', name: 'Ava Martinez', score: 1267, rank: 8 },
  ];

  const discussions: Discussion[] = [
    { id: '1', title: 'Tips for reading faster?', author: 'ReadingBuddy123', replies: 12, lastActivity: '2h ago', topic: 'Reading' },
    { id: '2', title: 'Best OCR camera settings', author: 'TechHelper', replies: 8, lastActivity: '5h ago', topic: 'Technology' },
    { id: '3', title: 'Celebrating small wins!', author: 'ProgressMaker', replies: 23, lastActivity: '1d ago', topic: 'Motivation' },
    { id: '4', title: 'Letter b and d confusion help', author: 'LearnerSam', replies: 15, lastActivity: '1d ago', topic: 'Learning' },
    { id: '5', title: 'Daily practice routine ideas', author: 'StudyPal', replies: 6, lastActivity: '2d ago', topic: 'Study Tips' },
    { id: '6', title: 'Thank you community!', author: 'GratefulLearner', replies: 18, lastActivity: '3d ago', topic: 'Appreciation' },
  ];

  const handleJoinDiscussion = (_discussionId: string) => {
    showInfo('💬 Opening discussion thread...');
  };

  const handleStartDiscussion = () => {
    showInfo('✍️ Opening discussion form...');
  };

  const handleViewProfile = (_userId: string) => {
    showInfo('👤 Opening user profile...');
  };

  if (!fontsLoaded) {
    return null;
  }



  const renderLeaderboardEntry = ({ item }: { item: LeaderboardEntry }) => (
    <TouchableOpacity style={styles.leaderboardEntry} onPress={() => handleViewProfile(item.id)}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankNumber}>{item.rank}</Text>
        {item.badge && <Text style={styles.badge}>{item.badge}</Text>}
      </View>
      <View style={styles.playerInfo}>
        <Text style={[styles.playerName, item.name.includes('You') && styles.currentUser]}>{item.name}</Text>
        <Text style={styles.playerScore}>{item.score.toLocaleString()} points</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
    </TouchableOpacity>
  );

  const renderDiscussion = ({ item }: { item: Discussion }) => (
    <TouchableOpacity style={styles.discussionCard} onPress={() => handleJoinDiscussion(item.id)}>
      <View style={styles.discussionHeader}>
        <Text style={styles.discussionTitle}>{item.title}</Text>
        <View style={styles.topicTag}>
          <Text style={styles.topicText}>{item.topic}</Text>
        </View>
      </View>
      <View style={styles.discussionMeta}>
        <Text style={styles.authorText}>by {item.author}</Text>
        <Text style={styles.metaText}>{item.replies} replies • {item.lastActivity}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Connect, learn, and grow together</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Ionicons name="home" size={14} color={activeTab === 'overview' ? '#3DB2FF' : '#888888'} />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Ionicons name="trophy" size={16} color={activeTab === 'leaderboard' ? '#3DB2FF' : '#888888'} />
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>Rankings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'discussions' && styles.activeTab]}
          onPress={() => setActiveTab('discussions')}
        >
          <Ionicons name="chatbubbles" size={16} color={activeTab === 'discussions' ? '#3DB2FF' : '#888888'} />
          <Text style={[styles.tabText, activeTab === 'discussions' && styles.activeTabText]}>Discussions</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }}>
        {activeTab === 'overview' && (
          <>
            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>2nd</Text>
                <Text style={styles.statLabel}>Your Rank</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1,890</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
            </View>



            {/* Top Discussions */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Hot Discussions</Text>
                <TouchableOpacity onPress={handleStartDiscussion}>
                  <Text style={styles.sectionAction}>Start New</Text>
                </TouchableOpacity>
              </View>
              {discussions.slice(0, 3).map(discussion => (
                <TouchableOpacity key={discussion.id} style={styles.discussionCard} onPress={() => handleJoinDiscussion(discussion.id)}>
                  <Text style={styles.discussionTitle}>{discussion.title}</Text>
                  <Text style={styles.metaText}>{discussion.replies} replies • {discussion.lastActivity}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {activeTab === 'leaderboard' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Weekly Leaderboard</Text>
            <FlatList
              data={leaderboard}
              renderItem={renderLeaderboardEntry}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}



        {activeTab === 'discussions' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Community Discussions</Text>
              <TouchableOpacity style={styles.newDiscussionButton} onPress={handleStartDiscussion}>
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.newDiscussionText}>New</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={discussions}
              renderItem={renderDiscussion}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
      
      {/* Toast Notification */}
      <ToastNotification
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 15,
    marginHorizontal: 1,
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
  },
  tabText: {
    fontSize: 10,
    color: '#888888',
    fontFamily: 'OpenDyslexic-Regular',
    marginLeft: 3,
  },
  activeTabText: {
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 15,
  },
  sectionAction: {
    fontSize: 14,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
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
  leaderboardEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  rankNumber: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginRight: 5,
  },
  badge: {
    fontSize: 16,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  playerName: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 2,
  },
  currentUser: {
    color: '#3DB2FF',
  },
  playerScore: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  discussionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  discussionTitle: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    flex: 1,
    marginRight: 10,
  },
  topicTag: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  topicText: {
    fontSize: 10,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  discussionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  authorText: {
    fontSize: 12,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Regular',
  },
  metaText: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'OpenDyslexic-Regular',
  },
  newDiscussionButton: {
    backgroundColor: '#3DB2FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  newDiscussionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 4,
  },
});

export default CommunityScreen;

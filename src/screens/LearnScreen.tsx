import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { topicsService, Topic, Chapter } from '../services/topicsService';
import { GlobalContext } from '../GlobalState';

interface TopicWithChapters extends Topic {
  chapters?: Chapter[];
}

const LearnScreen = ({ navigation }: any) => {
  const [topics, setTopics] = useState<TopicWithChapters[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Global state for chapter completion
  const { isChapterComplete } = React.useContext(GlobalContext);

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  // Fetch topics and chapters
  const fetchTopics = async () => {
    try {
      setError(null);
      const topicsWithChapters = await topicsService.getTopicsWithChapters();
      setTopics(topicsWithChapters);
    } catch (err: any) {
      console.error('Error fetching topics:', err);
      setError(err.message || 'Failed to load topics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (fontsLoaded) {
      fetchTopics();
    }
  }, [fontsLoaded]);

  // Refresh topics when screen is focused (e.g., when navigating from camera)
  useFocusEffect(
    React.useCallback(() => {
      if (fontsLoaded) {
        fetchTopics();
      }
    }, [fontsLoaded])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTopics();
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const isChapterCompleted = (chapter: Chapter): boolean => {
    return isChapterComplete(chapter.topic_id, chapter.id);
  };

  const openTopic = (topicId: number) => {
    navigation.navigate('TopicDetail', { topicId });
  };

  const renderTopicCard = (topic: TopicWithChapters) => {
    const chapters = topic.chapters || [];
    const totalChapters = chapters.length;

    return (
      <TouchableOpacity 
        key={topic.id} 
        style={styles.topicCard}
        onPress={() => openTopic(topic.id)}
        activeOpacity={0.7}
      >
        <View style={styles.topicHeader}>
          <View style={styles.topicInfo}>
            <Text style={styles.topicTitle} numberOfLines={2}>
              {topic.title}
            </Text>
            <Text style={styles.topicDescription} numberOfLines={3}>
              {topic.description}
            </Text>
          </View>
          {topic.extracted_images && topic.extracted_images.length > 0 && (
            <Image 
              source={{ uri: topic.extracted_images[0] }} 
              style={styles.topicImage}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.topicStats}>
          <View style={styles.statItem}>
            <Ionicons name="book-outline" size={16} color="#3DB2FF" />
            <Text style={styles.statText}>{totalChapters} chapters</Text>
          </View>
        </View>

        {/* Chapters preview */}
        {chapters.length > 0 && (
          <View style={styles.chaptersPreview}>
            <Text style={styles.chaptersTitle}>Chapters:</Text>
            {chapters.slice(0, 3).map((chapter) => (
              <View key={chapter.id} style={styles.chapterItem}>
                <View style={[
                  styles.chapterNumber,
                  { backgroundColor: isChapterCompleted(chapter) ? '#4CAF50' : '#E0E0E0' }
                ]}>
                  <Text style={[
                    styles.chapterNumberText,
                    { color: isChapterCompleted(chapter) ? '#FFFFFF' : '#666666' }
                  ]}>
                    {chapter.chapter_order}
                  </Text>
                </View>
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle} numberOfLines={1}>
                    {chapter.title}
                  </Text>
                  <Text style={styles.chapterDuration}>
                    {formatDuration(chapter.estimated_duration_minutes)}
                  </Text>
                </View>
                {isChapterCompleted(chapter) && (
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                )}
              </View>
            ))}
            {chapters.length > 3 && (
              <Text style={styles.moreChapters}>
                +{chapters.length - 3} more chapters
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Show loading indicator while fonts load
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3DB2FF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#3DB2FF']}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learn</Text>
        <Text style={styles.headerSubtitle}>
          Track your progress across all learning topics
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3DB2FF" />
            <Text style={styles.loadingText}>Loading your topics...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#FF6B6B" />
            <Text style={styles.errorTitle}>Unable to load topics</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchTopics}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : topics.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={60} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No Topics Yet</Text>
            <Text style={styles.emptyText}>
              Create your first learning topic by uploading content in the Camera section
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Your Learning Progress</Text>
              <Text style={styles.statsSubtitle}>
                {topics.length} topic{topics.length !== 1 ? 's' : ''} available
              </Text>
            </View>
            {topics.map(renderTopicCard)}
          </>
        )}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  errorTitle: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#3DB2FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsHeader: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 5,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  topicCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  topicHeader: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  topicInfo: {
    flex: 1,
    marginRight: 15,
  },
  topicTitle: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  topicDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    lineHeight: 20,
  },
  topicImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  topicStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    maxWidth: '30%',
  },
  statText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    flex: 1,
  },
  chaptersPreview: {
    marginTop: 10,
  },
  chaptersTitle: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 10,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  chapterNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chapterNumberText: {
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Bold',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 13,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 2,
  },
  chapterDuration: {
    fontSize: 11,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  moreChapters: {
    fontSize: 12,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Regular',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default LearnScreen;

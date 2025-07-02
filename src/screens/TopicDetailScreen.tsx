import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { topicsService, Chapter } from '../services/topicsService';
import { GlobalContext } from '../GlobalState';

interface TopicSummary {
  id: number;
  title: string;
  description: string;
  status: string;
}

const TopicDetailScreen = ({ route, navigation }: any) => {
  const { topicId } = route.params;
  const insets = useSafeAreaInsets();
  const [topic, setTopic] = useState<TopicSummary | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Global state for chapter completion
  const { markChapterComplete, isChapterComplete } = useContext(GlobalContext);

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  const fetchTopicDetails = useCallback(async () => {
    try {
      setError(null);
      const response = await topicsService.getTopicChapters(topicId);
      setTopic(response.data.topic);
      setChapters(response.data.chapters);
    } catch (err: any) {
      console.error('Error fetching topic details:', err);
      setError(err.message || 'Failed to load topic details');
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    if (fontsLoaded) {
      fetchTopicDetails();
    }
  }, [fontsLoaded, fetchTopicDetails]);



  const openChapter = (chapter: Chapter) => {
    navigation.navigate('ChapterDetail', {
      topicId,
      chapterId: chapter.id,
      topicTitle: topic?.title,
    });
  };

  const handleMarkChapterComplete = (chapter: Chapter) => {
    markChapterComplete(topicId, chapter.id);
  };

  const isChapterCompleted = (chapter: Chapter): boolean => {
    return isChapterComplete(topicId, chapter.id);
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3DB2FF" />
        <Text style={styles.loadingText}>Loading topic details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Unable to load topic</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTopicDetails}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Topic Details</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Topic Header */}
        {topic && (
          <View style={styles.topicHeader}>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            <Text style={styles.topicDescription}>{topic.description}</Text>
            
            <View style={styles.topicStats}>
              <View style={styles.statItem}>
                <Ionicons name="book-outline" size={20} color="#3DB2FF" />
                <Text style={styles.statText}>{chapters.length} chapters</Text>
              </View>
            </View>
          </View>
        )}

        {/* Chapters Section */}
        <View style={styles.chaptersSection}>
          <Text style={styles.sectionTitle}>Chapters ({chapters.length})</Text>
          
          {chapters.map((chapter, _index) => (
            <View key={chapter.id} style={styles.chapterCard}>
              {/* Completion Status Badge */}
              {isChapterCompleted(chapter) && (
                <View style={styles.completionBadge}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.completionText}>Completed</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.chapterContent}
                onPress={() => openChapter(chapter)}
                activeOpacity={0.7}
              >
                <View style={styles.chapterHeader}>
                  <View style={[styles.chapterNumber, isChapterCompleted(chapter) && styles.chapterNumberCompleted]}>
                    <Text style={styles.chapterNumberText}>{chapter.chapter_order}</Text>
                  </View>
                  <View style={styles.chapterInfo}>
                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                    <Text style={styles.chapterDescription} numberOfLines={2}>
                      {chapter.description}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#666666" />
                </View>
              </TouchableOpacity>

              {/* Mark as Complete Button */}
              {!isChapterCompleted(chapter) && (
                <TouchableOpacity
                  style={styles.markCompleteButton}
                  onPress={() => handleMarkChapterComplete(chapter)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="checkmark-circle-outline" size={18} color="#4CAF50" />
                  <Text style={styles.markCompleteButtonText}>Mark as Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  header: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 70,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topicHeader: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  topicTitle: {
    fontSize: 24,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 10,
    lineHeight: 32,
  },
  topicDescription: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 20,
    lineHeight: 24,
  },
  topicStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
  },
  chaptersSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 20,
  },
  chapterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  completionBadge: {
    position: 'absolute',
    top: -8,
    right: 15,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    zIndex: 10,
  },
  completionText: {
    fontSize: 12,
    color: '#4CAF50',
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 4,
  },
  chapterContent: {
    padding: 20,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  chapterNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3DB2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  chapterNumberCompleted: {
    backgroundColor: '#4CAF50',
  },
  chapterNumberText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 5,
  },
  chapterDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    lineHeight: 20,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  markCompleteButton: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markCompleteButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 8,
  },
});

export default TopicDetailScreen; 
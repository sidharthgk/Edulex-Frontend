import React, { useState, useEffect, useCallback } from 'react';
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

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const getDifficultyColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#2196F3';
    }
  };

  const getDifficultyIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'leaf-outline' as const;
      case 'intermediate': return 'flame-outline' as const;
      case 'advanced': return 'flash-outline' as const;
      default: return 'book-outline' as const;
    }
  };

  const openChapter = (chapter: Chapter) => {
    navigation.navigate('ChapterDetail', {
      topicId,
      chapterId: chapter.id,
      topicTitle: topic?.title,
    });
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={20} color="#3DB2FF" />
                <Text style={styles.statText}>
                  {formatDuration(chapters.reduce((total, chapter) => total + chapter.estimated_duration_minutes, 0))}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                <Text style={styles.statText}>{topic.status}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Chapters Section */}
        <View style={styles.chaptersSection}>
          <Text style={styles.sectionTitle}>Chapters ({chapters.length})</Text>
          
          {chapters.map((chapter, _index) => (
            <TouchableOpacity
              key={chapter.id}
              style={styles.chapterCard}
              onPress={() => openChapter(chapter)}
              activeOpacity={0.7}
            >
              <View style={styles.chapterHeader}>
                <View style={styles.chapterNumber}>
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

              <View style={styles.chapterMeta}>
                <View style={styles.metaItem}>
                  <Ionicons 
                    name={getDifficultyIcon(chapter.difficulty_level)} 
                    size={16} 
                    color={getDifficultyColor(chapter.difficulty_level)} 
                  />
                  <Text style={[styles.metaText, { color: getDifficultyColor(chapter.difficulty_level) }]}>
                    {chapter.difficulty_level}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color="#666666" />
                  <Text style={styles.metaText}>
                    {formatDuration(chapter.estimated_duration_minutes)}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="list-outline" size={16} color="#666666" />
                  <Text style={styles.metaText}>
                    {chapter.learning_objectives.length} objectives
                  </Text>
                </View>
              </View>

              {/* Learning Objectives Preview */}
              {chapter.learning_objectives.length > 0 && (
                <View style={styles.objectivesPreview}>
                  <Text style={styles.objectivesTitle}>Learning Objectives:</Text>
                  {chapter.learning_objectives.slice(0, 2).map((objective, objIndex) => (
                    <Text key={objIndex} style={styles.objectiveText}>
                      • {objective}
                    </Text>
                  ))}
                  {chapter.learning_objectives.length > 2 && (
                    <Text style={styles.moreObjectives}>
                      +{chapter.learning_objectives.length - 2} more objectives
                    </Text>
                  )}
                </View>
              )}

              {/* Progress Indicator (placeholder) */}
              <View style={styles.progressIndicator}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '0%' }]} />
                </View>
                <Text style={styles.progressText}>Not started</Text>
              </View>
            </TouchableOpacity>
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
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  chapterMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    marginLeft: 5,
    fontSize: 12,
    fontFamily: 'OpenDyslexic-Regular',
  },
  objectivesPreview: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  objectivesTitle: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 8,
  },
  objectiveText: {
    fontSize: 13,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 4,
    lineHeight: 18,
  },
  moreObjectives: {
    fontSize: 12,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Regular',
    marginTop: 5,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    minWidth: 80,
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
});

export default TopicDetailScreen; 
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

const ChapterDetailScreen = ({ route, navigation }: any) => {
  const { topicId, chapterId, topicTitle } = route.params;
  const insets = useSafeAreaInsets();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  const fetchChapterDetails = useCallback(async () => {
    try {
      setError(null);
      const response = await topicsService.getTopicChapters(topicId);
      const targetChapter = response.data.chapters.find(ch => ch.id === chapterId);
      if (targetChapter) {
        setChapter(targetChapter);
      } else {
        setError('Chapter not found');
      }
    } catch (err: any) {
      console.error('Error fetching chapter details:', err);
      setError(err.message || 'Failed to load chapter details');
    } finally {
      setLoading(false);
    }
  }, [topicId, chapterId]);

  useEffect(() => {
    if (fontsLoaded) {
      fetchChapterDetails();
    }
  }, [fontsLoaded, fetchChapterDetails]);

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

  const parseContent = (content: string) => {
    // Simple markdown-like parsing for better display
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          // Bold text
          return { type: 'heading', text: line.slice(2, -2), key: index };
        } else if (line.startsWith('- ')) {
          // Bullet point
          return { type: 'bullet', text: line.slice(2), key: index };
        } else if (line.trim() === '') {
          // Empty line
          return { type: 'space', text: '', key: index };
        } else {
          // Regular text
          return { type: 'text', text: line, key: index };
        }
      });
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3DB2FF" />
        <Text style={styles.loadingText}>Loading chapter...</Text>
      </View>
    );
  }

  if (error || !chapter) {
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
          <Text style={styles.errorTitle}>Unable to load chapter</Text>
          <Text style={styles.errorText}>{error || 'Chapter not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchChapterDetails}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const contentParts = parseContent(chapter.content);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#3DB2FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Chapter {chapter.chapter_order}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Chapter Header */}
        <View style={styles.chapterHeader}>
          <View style={styles.breadcrumb}>
            <Text style={styles.breadcrumbText}>{topicTitle}</Text>
            <Ionicons name="chevron-forward" size={16} color="#666666" />
            <Text style={styles.breadcrumbText}>Chapter {chapter.chapter_order}</Text>
          </View>
          
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          <Text style={styles.chapterDescription}>{chapter.description}</Text>

          <View style={styles.chapterMeta}>
            <View style={styles.metaItem}>
              <Ionicons 
                name={getDifficultyIcon(chapter.difficulty_level)} 
                size={18} 
                color={getDifficultyColor(chapter.difficulty_level)} 
              />
              <Text style={[styles.metaText, { color: getDifficultyColor(chapter.difficulty_level) }]}>
                {chapter.difficulty_level}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={18} color="#666666" />
              <Text style={styles.metaText}>
                {formatDuration(chapter.estimated_duration_minutes)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#4CAF50" />
              <Text style={styles.metaText}>{chapter.status}</Text>
            </View>
          </View>
        </View>

        {/* Learning Objectives */}
        {chapter.learning_objectives.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Learning Objectives</Text>
            <View style={styles.objectivesList}>
              {chapter.learning_objectives.map((objective, index) => (
                <View key={index} style={styles.objectiveItem}>
                  <View style={styles.objectiveBullet} />
                  <Text style={styles.objectiveText}>{objective}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Chapter Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 Content</Text>
          <View style={styles.contentContainer}>
            {contentParts.map((part) => {
              switch (part.type) {
                case 'heading':
                  return (
                    <Text key={part.key} style={styles.contentHeading}>
                      {part.text}
                    </Text>
                  );
                case 'bullet':
                  return (
                    <View key={part.key} style={styles.bulletItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{part.text}</Text>
                    </View>
                  );
                case 'space':
                  return <View key={part.key} style={styles.contentSpace} />;
                default:
                  return (
                    <Text key={part.key} style={styles.contentText}>
                      {part.text}
                    </Text>
                  );
              }
            })}
          </View>
        </View>

        {/* Activities */}
        {chapter.activities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎮 Activities</Text>
            <View style={styles.activitiesList}>
              {chapter.activities.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Ionicons name="play-circle-outline" size={20} color="#4CAF50" />
                  <Text style={styles.activityText}>{activity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Assessments */}
        {chapter.assessments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Assessments</Text>
            <View style={styles.assessmentsList}>
              {chapter.assessments.map((assessment, index) => (
                <View key={index} style={styles.assessmentItem}>
                  <Ionicons name="checkmark-outline" size={20} color="#FF9800" />
                  <Text style={styles.assessmentText}>{assessment}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Resources */}
        {chapter.resources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📚 Resources</Text>
            <View style={styles.resourcesList}>
              {chapter.resources.map((resource, index) => (
                <View key={index} style={styles.resourceItem}>
                  <Ionicons name="link-outline" size={20} color="#2196F3" />
                  <Text style={styles.resourceText}>{resource}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Dyslexia Adaptations */}
        {chapter.dyslexia_adaptations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>♿ Accessibility Features</Text>
            <View style={styles.adaptationsList}>
              {chapter.dyslexia_adaptations.map((adaptation, index) => (
                <View key={index} style={styles.adaptationItem}>
                  <Ionicons name="accessibility-outline" size={20} color="#9C27B0" />
                  <Text style={styles.adaptationText}>{adaptation}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Progress Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.startButton}>
            <Ionicons name="play" size={20} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Learning</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.markCompleteButton}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.markCompleteButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
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
  chapterHeader: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    marginHorizontal: 5,
  },
  chapterTitle: {
    fontSize: 24,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 10,
    lineHeight: 32,
  },
  chapterDescription: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'OpenDyslexic-Regular',
    marginBottom: 20,
    lineHeight: 24,
  },
  chapterMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'OpenDyslexic-Regular',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 15,
  },
  objectivesList: {
    marginLeft: 10,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  objectiveBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3DB2FF',
    marginTop: 8,
    marginRight: 12,
  },
  objectiveText: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
    lineHeight: 22,
  },
  contentContainer: {
    marginLeft: 10,
  },
  contentHeading: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Bold',
    marginBottom: 10,
    marginTop: 10,
  },
  contentText: {
    fontSize: 15,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
    lineHeight: 24,
    marginBottom: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    marginLeft: 10,
  },
  bulletPoint: {
    fontSize: 15,
    color: '#3DB2FF',
    fontFamily: 'OpenDyslexic-Bold',
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
    lineHeight: 22,
  },
  contentSpace: {
    height: 10,
  },
  activitiesList: {
    marginLeft: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 8,
  },
  activityText: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
    lineHeight: 22,
    marginLeft: 10,
  },
  assessmentsList: {
    marginLeft: 10,
  },
  assessmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
  },
  assessmentText: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
    lineHeight: 22,
    marginLeft: 10,
  },
  resourcesList: {
    marginLeft: 10,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
  },
  resourceText: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
    lineHeight: 22,
    marginLeft: 10,
  },
  adaptationsList: {
    marginLeft: 10,
  },
  adaptationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#F3E5F5',
    padding: 12,
    borderRadius: 8,
  },
  adaptationText: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    fontFamily: 'OpenDyslexic-Regular',
    lineHeight: 22,
    marginLeft: 10,
  },
  actionsSection: {
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 8,
  },
  markCompleteButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  markCompleteButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 8,
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

export default ChapterDetailScreen; 
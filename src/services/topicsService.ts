import authService from './authService';

// Types for Topic API responses
export interface TopicMetadata {
  created_at_utc: string;
  ocr_service: string;
  ai_generated_metadata: {
    key_topics: string[];
    content_category: string;
    generated_by: string;
    generated_at: string;
  };
  file_name: string;
  file_size: number;
  mime_type: string;
  processing_method: string;
  images_count: number;
  session_dir: string;
  curriculum_generated: boolean;
  curriculum_generated_at: string;
  total_chapters: number;
  total_duration_minutes: number;
}

export interface Topic {
  id: number;
  user_id: number;
  title: string;
  description: string;
  content: string;
  source_type: string;
  content_type: string;
  metadata: TopicMetadata;
  extracted_images: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TopicsResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Topic[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

// Types for Chapters API responses
export interface ChapterMetadata {
  generated_by: string;
  generated_at: string;
  curriculum_summary: {
    total_chapters: number;
    teaching_approach: string;
    key_adaptations: string[];
  };
}

export interface Chapter {
  id: number;
  topic_id: number;
  user_id: number;
  title: string;
  description: string;
  content: string;
  chapter_order: number;
  difficulty_level: string;
  estimated_duration_minutes: number;
  learning_objectives: string[];
  dyslexia_adaptations: string[];
  activities: string[];
  assessments: string[];
  resources: string[];
  metadata: ChapterMetadata;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ChaptersResponse {
  success: boolean;
  message: string;
  data: {
    topic: {
      id: number;
      title: string;
      description: string;
      status: string;
    };
    chapters: Chapter[];
    total_chapters: number;
    total_duration: string;
  };
}

// Types for Video API responses
export interface ChapterVideo {
  video_url: string;
  transcript: string;
  duration_seconds: number;
  last_generated_at: string;
}

export interface VideoResponse {
  success: boolean;
  message: string;
  data: ChapterVideo;
}

class TopicsService {
  // Get all topics with pagination and filtering
  async getTopics(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    content_type?: string;
    search?: string;
  }): Promise<TopicsResponse> {
    console.log('📚 Fetching topics (MOCK)...');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockTopics: Topic[] = [
      {
        id: 1,
        user_id: 1,
        title: 'Understanding Dyslexia',
        description: 'A comprehensive guide to understanding what dyslexia is and how it affects learning.',
        content: 'Dyslexia is a learning disorder that involves difficulty reading due to problems identifying speech sounds and learning how they relate to letters and words (decoding).',
        source_type: 'text',
        content_type: 'educational',
        metadata: {
          created_at_utc: new Date().toISOString(),
          ocr_service: 'mock',
          ai_generated_metadata: {
            key_topics: ['Dyslexia', 'Learning', 'Reading'],
            content_category: 'Education',
            generated_by: 'Mock AI',
            generated_at: new Date().toISOString(),
          },
          file_name: 'dyslexia_intro.pdf',
          file_size: 1024,
          mime_type: 'application/pdf',
          processing_method: 'mock',
          images_count: 2,
          session_dir: '/tmp',
          curriculum_generated: true,
          curriculum_generated_at: new Date().toISOString(),
          total_chapters: 3,
          total_duration_minutes: 45,
        },
        extracted_images: [],
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        user_id: 1,
        title: 'Phonemic Awareness',
        description: 'Learn about the ability to hear, identify, and manipulate individual sounds-phonemes--in spoken words.',
        content: 'Phonemic awareness is the foundation for learning to read. It is the ability to hear and manipulate the sounds in spoken words and the understanding that spoken words and syllables are made up of sequences of speech sounds.',
        source_type: 'video',
        content_type: 'educational',
        metadata: {
          created_at_utc: new Date().toISOString(),
          ocr_service: 'mock',
          ai_generated_metadata: {
            key_topics: ['Phonemes', 'Sounds', 'Reading'],
            content_category: 'Education',
            generated_by: 'Mock AI',
            generated_at: new Date().toISOString(),
          },
          file_name: 'phonemic_awareness.mp4',
          file_size: 2048,
          mime_type: 'video/mp4',
          processing_method: 'mock',
          images_count: 0,
          session_dir: '/tmp',
          curriculum_generated: true,
          curriculum_generated_at: new Date().toISOString(),
          total_chapters: 2,
          total_duration_minutes: 30,
        },
        extracted_images: [],
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        user_id: 1,
        title: 'Reading Strategies',
        description: 'Effective strategies to improve reading speed and comprehension.',
        content: 'Reading strategies are the broad, problem-solving plans that readers use to decipher text and make meaning.',
        source_type: 'text',
        content_type: 'educational',
        metadata: {
          created_at_utc: new Date().toISOString(),
          ocr_service: 'mock',
          ai_generated_metadata: {
            key_topics: ['Strategies', 'Comprehension', 'Speed'],
            content_category: 'Education',
            generated_by: 'Mock AI',
            generated_at: new Date().toISOString(),
          },
          file_name: 'reading_strategies.pdf',
          file_size: 1024,
          mime_type: 'application/pdf',
          processing_method: 'mock',
          images_count: 1,
          session_dir: '/tmp',
          curriculum_generated: true,
          curriculum_generated_at: new Date().toISOString(),
          total_chapters: 4,
          total_duration_minutes: 60,
        },
        extracted_images: [],
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];

    return {
      success: true,
      message: 'Topics fetched successfully (MOCK)',
      data: {
        current_page: 1,
        data: mockTopics,
        first_page_url: 'mock-url',
        from: 1,
        last_page: 1,
        last_page_url: 'mock-url',
        links: [],
        next_page_url: null,
        path: 'mock-path',
        per_page: 10,
        prev_page_url: null,
        to: 3,
        total: 3,
      },
    };
  }

  // Get chapters for a specific topic
  async getTopicChapters(topicId: number): Promise<ChaptersResponse> {
    console.log(`📖 Fetching chapters for topic ${topicId} (MOCK)...`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const mockChapters: Chapter[] = [
      {
        id: 101,
        topic_id: topicId,
        user_id: 1,
        title: 'Introduction',
        description: 'Getting started with the basics.',
        content: 'This is the introductory chapter content.',
        chapter_order: 1,
        difficulty_level: 'Beginner',
        estimated_duration_minutes: 10,
        learning_objectives: ['Understand basic concepts'],
        dyslexia_adaptations: ['Simplified text', 'Audio support'],
        activities: ['Quiz'],
        assessments: [],
        resources: [],
        metadata: {
          generated_by: 'Mock AI',
          generated_at: new Date().toISOString(),
          curriculum_summary: {
            total_chapters: 3,
            teaching_approach: 'Visual',
            key_adaptations: ['Visual aids'],
          },
        },
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 102,
        topic_id: topicId,
        user_id: 1,
        title: 'Core Concepts',
        description: 'Deep dive into the main ideas.',
        content: 'This chapter covers the core concepts in detail.',
        chapter_order: 2,
        difficulty_level: 'Intermediate',
        estimated_duration_minutes: 20,
        learning_objectives: ['Master core concepts'],
        dyslexia_adaptations: ['Highlighted text'],
        activities: ['Reading'],
        assessments: [],
        resources: [],
        metadata: {
          generated_by: 'Mock AI',
          generated_at: new Date().toISOString(),
          curriculum_summary: {
            total_chapters: 3,
            teaching_approach: 'Visual',
            key_adaptations: ['Visual aids'],
          },
        },
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];

    return {
      success: true,
      message: 'Chapters fetched successfully (MOCK)',
      data: {
        topic: {
          id: topicId,
          title: 'Mock Topic Title',
          description: 'Mock Topic Description',
          status: 'completed',
        },
        chapters: mockChapters,
        total_chapters: 2,
        total_duration: '30 mins',
      },
    };
  }

  // Get all topics with their chapters (for progress overview)
  async getTopicsWithChapters(): Promise<Array<Topic & { chapters?: Chapter[] }>> {
    console.log('📚 Fetching topics with chapters (MOCK)...');
    try {
      // First get all topics
      const topicsResponse = await this.getTopics({ per_page: 100 });
      const topics = topicsResponse.data.data;

      // Then get chapters for each topic
      const topicsWithChapters = await Promise.all(
        topics.map(async (topic) => {
          try {
            const chaptersResponse = await this.getTopicChapters(topic.id);
            return {
              ...topic,
              chapters: chaptersResponse.data.chapters,
            };
          } catch (error) {
            console.error(`Failed to fetch chapters for topic ${topic.id}:`, error);
            return {
              ...topic,
              chapters: [],
            };
          }
        })
      );

      return topicsWithChapters;
    } catch (error) {
      console.error('Error fetching topics with chapters:', error);
      throw error;
    }
  }

  // Get video for a specific chapter
  async getChapterVideo(topicId: number, chapterId: number): Promise<VideoResponse> {
    console.log(`🎥 Fetching video for chapter ${chapterId} (MOCK)...`);

    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: 'Video fetched successfully (MOCK)',
      data: {
        video_url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Sample video
        transcript: 'This is a mock transcript for the video.',
        duration_seconds: 600,
        last_generated_at: new Date().toISOString(),
      },
    };
  }
}

export const topicsService = new TopicsService();
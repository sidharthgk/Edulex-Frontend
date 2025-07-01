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

class TopicsService {
  // Get all topics with pagination and filtering
  async getTopics(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    content_type?: string;
    search?: string;
  }): Promise<TopicsResponse> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.content_type) queryParams.append('content_type', params.content_type);
      if (params?.search) queryParams.append('search', params.search);

      const queryString = queryParams.toString();
      const endpoint = `/api/topics${queryString ? `?${queryString}` : ''}`;

      return await authService.makeAuthenticatedRequest(endpoint, 'GET');
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  }

  // Get chapters for a specific topic
  async getTopicChapters(topicId: number): Promise<ChaptersResponse> {
    try {
      return await authService.makeAuthenticatedRequest(`/api/topics/${topicId}/chapters`, 'GET');
    } catch (error) {
      console.error(`Error fetching chapters for topic ${topicId}:`, error);
      throw error;
    }
  }

  // Get all topics with their chapters (for progress overview)
  async getTopicsWithChapters(): Promise<Array<Topic & { chapters?: Chapter[] }>> {
    try {
      // First get all topics
      const topicsResponse = await this.getTopics({ per_page: 100 }); // Get more topics
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
}

export const topicsService = new TopicsService(); 
import { API_CONFIG } from '../constants/config';

export interface AvatarTalkRequest {
  text: string;
  avatar: string;
  emotion: string;
  language: string;
  stream?: boolean;
}

export interface AvatarTalkResponse {
  id: string;
  status: string;
  stream: boolean;
  text: string;
  created_at: string;
  language: string;
  credits_consumed: number;
  avatar: string;
  emotion: string;
  file_size_bytes: number;
  inference_duration_ms: number;
  video_duration_seconds: number;
  mp4_url: string;
}

export interface AvatarTalkError {
  status: string;
  error_code: string;
  message: string;
  details?: any;
}

class AvatarTalkService {
  private baseUrl = API_CONFIG.AVATAR_TALK.BASE_URL;
  private apiKey = API_CONFIG.AVATAR_TALK.API_KEY;

  /**
   * Generate avatar video from text
   */
  async generateVideo(request: AvatarTalkRequest): Promise<AvatarTalkResponse> {
    try {
      console.log('🎬 AvatarTalk: Starting video generation...');
      console.log('📝 Request parameters:', {
        textLength: request.text.length,
        avatar: request.avatar,
        emotion: request.emotion,
        language: request.language,
        stream: request.stream || false,
      });

      const url = request.stream 
        ? `${this.baseUrl}?stream=true`
        : this.baseUrl;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          avatar: request.avatar,
          emotion: request.emotion,
          language: request.language,
        }),
      });

      console.log('📡 AvatarTalk Response Status:', response.status);
      console.log('📡 AvatarTalk Response OK:', response.ok);

      if (!response.ok) {
        const errorData: AvatarTalkError = await response.json();
        console.error('❌ AvatarTalk Error:', errorData);
        throw new Error(`AvatarTalk API Error: ${errorData.message}`);
      }

      if (request.stream) {
        // For streaming responses, we would handle binary data differently
        // For now, we'll focus on regular JSON responses
        throw new Error('Streaming mode not implemented in this version');
      }

      const result: AvatarTalkResponse = await response.json();
      
      console.log('✅ AvatarTalk Success!');
      console.log('🎥 Video Details:', {
        id: result.id,
        duration: result.video_duration_seconds,
        fileSize: result.file_size_bytes,
        creditsUsed: result.credits_consumed,
        url: result.mp4_url,
      });

      return result;
    } catch (error) {
      console.error('💥 AvatarTalk Service Error:', error);
      throw error;
    }
  }

  /**
   * Helper method to validate text length
   */
  validateText(text: string): { valid: boolean; message?: string } {
    if (!text || text.trim().length === 0) {
      return { valid: false, message: 'Text cannot be empty' };
    }

    if (text.length > 2000) {
      return { valid: false, message: 'Text is too long (max 2000 characters)' };
    }

    if (text.length < 10) {
      return { valid: false, message: 'Text is too short (min 10 characters)' };
    }

    return { valid: true };
  }

  /**
   * Helper method to truncate text if too long
   */
  truncateText(text: string, maxLength: number = 2000): string {
    if (text.length <= maxLength) {
      return text;
    }

    // Try to truncate at sentence boundary
    const truncated = text.substring(0, maxLength);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );

    if (lastSentenceEnd > maxLength * 0.8) {
      return truncated.substring(0, lastSentenceEnd + 1);
    }

    // If no good sentence boundary, truncate at word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > maxLength * 0.8 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }
}

export const avatarTalkService = new AvatarTalkService(); 
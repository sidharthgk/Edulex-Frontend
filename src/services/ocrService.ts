import { API_CONFIG } from '../constants/config';
import authService from './authService';

export interface OCRApiResponse {
  success: boolean;
  message: string;
  data: {
    text: string;
    images?: Array<{
      page: number;
      url: string;
      bbox: any;
      type: string;
    }>;
    topic_id?: number;
    curriculum_status?: boolean;
  };
}

export interface OCRResult {
  success: boolean;
  text: string;
  text_length: number;
  images?: Array<{
    page: number;
    url: string;
    bbox: any;
    type: string;
  }>;
  topic_id?: number;
  curriculum_status?: boolean;
  message?: string;
}

export interface OCRError {
  success: false;
  message: string;
  error_code?: string;
}

export interface TeachingPlanAction {
  action: string;
  type: string;
  details: string;
  parameters: {
    base_prompt: string;
    focused_study_areas: string[];
    time: string;
  };
}

export interface TeachingPlanResult {
  success: boolean;
  statusCode?: number;
  message: string;
  data: TeachingPlanAction[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface QuizResult {
  success: boolean;
  statusCode?: number;
  message: string;
  data: QuizQuestion[];
}

export interface SummarizationResult {
  success: boolean;
  statusCode?: number;
  message: string;
  data: string;
}

class OCRService {
  private baseUrl = API_CONFIG.EDULEX.BASE_URL;
  private ocrEndpoint = API_CONFIG.EDULEX.OCR_ENDPOINT;
  private teachingPlanEndpoint = API_CONFIG.EDULEX.TEACHING_PLAN_ENDPOINT;
  private quizEndpoint = API_CONFIG.EDULEX.QUIZ_ENDPOINT;
  private summarizationEndpoint = API_CONFIG.EDULEX.SUMMARIZATION_ENDPOINT;

  /**
   * Extract text from image using OCR API
   */
  async extractTextFromImage(imageUri: string): Promise<OCRResult> {
    try {
      console.log('🔍 OCR Service: Starting text extraction...');
      console.log('📸 Image URI:', imageUri);

      // Create form data for the API request
      const formData = new FormData();

      // Get the filename from the URI
      const filename = imageUri.split('/').pop() || 'captured_image.jpg';
      console.log('📄 Filename:', filename);

      const apiEndpoint = `${this.baseUrl}${this.ocrEndpoint}`;
      console.log('📡 OCR API Endpoint:', apiEndpoint);

      // Add the image file to form data
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: filename,
      } as any);

      console.log('📡 OCR API: Making request to', apiEndpoint);

      // Get authentication token
      const token = await authService.getToken();
      if (!token) {
        throw new Error('Authentication required. Please login first.');
      }

      const requestStartTime = Date.now();

      // Make API request to OCR endpoint with authentication
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - let the browser set it with boundary
        },
      });

      const requestEndTime = Date.now();
      const requestDuration = requestEndTime - requestStartTime;

      console.log(`⏱️ OCR API: Request completed in ${requestDuration}ms`);
      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = `OCR API responded with status ${response.status}`;
        try {
          const errorResult = await response.json();
          console.error('❌ OCR API Error Response:', errorResult);
          errorMessage = errorResult.message || errorMessage;
        } catch (parseError) {
          console.error('❌ Failed to parse error response as JSON:', parseError);
          const textResponse = await response.text();
          console.error('❌ Error response body:', textResponse.substring(0, 200));
          if (textResponse.includes('<html') || textResponse.includes('<!DOCTYPE')) {
            errorMessage = 'Authentication failed. Please login again.';
          }
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse success response as JSON:', parseError);
        const textResponse = await response.text();
        console.error('❌ Response body:', textResponse.substring(0, 200));
        throw new Error('Invalid response format from server');
      }

      console.log('🔍 OCR API Response:');
      console.log(JSON.stringify(result, null, 2));

      if (result.success && result.data) {
        // Handle new API response structure where text is in data.text
        const rawText = result.data.text || result.data || '';
        const cleanedText = this.parseMarkdownText(rawText.trim());
        const extractedImages = result.data.images || [];

        console.log('✅ OCR Success!');
        console.log('📝 Raw text length:', rawText.length);
        console.log('📝 Cleaned text length:', cleanedText.length);
        console.log('📄 Cleaned text preview:', cleanedText.substring(0, 100) + (cleanedText.length > 100 ? '...' : ''));
        console.log('🖼️ Images extracted:', extractedImages.length);

        if (extractedImages.length > 0) {
          console.log('📸 Image URLs:', extractedImages.map((img: { page: number; url: string; bbox: any; type: string }) => img.url));
        }

        if (cleanedText.length > 0 || extractedImages.length > 0) {
          return {
            success: true,
            text: cleanedText,
            text_length: cleanedText.length,
            images: extractedImages,
            topic_id: result.data.topic_id,
            curriculum_status: result.data.curriculum_status,
          };
        } else {
          console.log('⚠️ OCR Success but no text or images found');
          return {
            success: false,
            text: '',
            text_length: 0,
            images: [],
            topic_id: result.data.topic_id,
            curriculum_status: result.data.curriculum_status,
            message: 'No readable text or images were found. Please try a clearer photo with better lighting.',
          };
        }
      } else {
        console.log('❌ OCR Failed - API returned success: false');
        throw new Error(result.message || 'Failed to extract text from image');
      }

    } catch (error) {
      console.error('💥 OCR Service Error:', error);

      let errorMessage = 'Failed to extract text from image. Please try again.';

      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage = 'Network connection failed. Please check your internet connection.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again with a smaller image.';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        text: '',
        text_length: 0,
        message: errorMessage,
      };
    }
  }

  /**
   * Generate teaching plan from extracted text
   */
  async generateTeachingPlan(text: string): Promise<TeachingPlanResult> {
    try {
      console.log('🎓 Teaching Plan: Starting generation...');
      console.log('📝 Input text length:', text.length);

      const apiEndpoint = `${this.baseUrl}${this.teachingPlanEndpoint}`;
      console.log('📡 Teaching Plan API Endpoint:', apiEndpoint);

      const requestBody = {
        text: this.cleanText(text),
      };

      console.log('📡 Teaching Plan API: Making request...');

      const requestStartTime = Date.now();

      const result: TeachingPlanResult = await authService.makeAuthenticatedRequest(
        this.teachingPlanEndpoint,
        'POST',
        requestBody
      );

      const requestEndTime = Date.now();
      const requestDuration = requestEndTime - requestStartTime;

      console.log(`⏱️ Teaching Plan API: Request completed in ${requestDuration}ms`);

      console.log('🔍 Teaching Plan API Response:');
      console.log(JSON.stringify(result, null, 2));

      if (result.success && result.data) {
        console.log('✅ Teaching Plan Generated!');
        console.log('📚 Number of teaching actions:', result.data.length);

        return result;
      } else {
        console.log('❌ Teaching Plan Failed - API returned success: false');
        throw new Error(result.message || 'Failed to generate teaching plan');
      }

    } catch (error) {
      console.error('💥 Teaching Plan Service Error:', error);

      let errorMessage = 'Failed to generate teaching plan. Please try again.';

      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage = 'Network connection failed. Please check your internet connection.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        message: errorMessage,
        data: [],
      };
    }
  }

  /**
   * Convert teaching plan to readable content for avatar
   */
  formatTeachingPlanForAvatar(teachingPlan: TeachingPlanAction[]): string {
    if (!teachingPlan || teachingPlan.length === 0) {
      return 'Let\'s explore this content together! I\'ll help you understand and learn from what we found.';
    }

    let content = 'Welcome to your personalized learning session! ';

    teachingPlan.forEach((action, index) => {
      if (index === 0) {
        content += `Let's start with ${action.action.toLowerCase()}. `;
      } else {
        content += `Next, we'll do ${action.action.toLowerCase()}. `;
      }

      content += `${action.details} `;

      if (action.parameters.time) {
        content += `This should take about ${action.parameters.time}. `;
      }
    });

    content += 'Remember, learning is a journey, and every step counts. Let\'s make this enjoyable and effective!';

    return content;
  }

  /**
   * Generate quiz questions from a topic
   */
  async generateQuiz(topic: string): Promise<QuizResult> {
    try {
      console.log('📝 Quiz Generation: Starting...');
      console.log('📚 Topic:', topic);

      const apiEndpoint = `${this.baseUrl}${this.quizEndpoint}`;
      console.log('📡 Quiz API Endpoint:', apiEndpoint);

      const requestBody = {
        topic: topic,
      };

      console.log('📡 Quiz API: Making request...');

      const requestStartTime = Date.now();

      const result: QuizResult = await authService.makeAuthenticatedRequest(
        this.quizEndpoint,
        'POST',
        requestBody
      );

      const requestEndTime = Date.now();
      const requestDuration = requestEndTime - requestStartTime;

      console.log(`⏱️ Quiz API: Request completed in ${requestDuration}ms`);

      console.log('🔍 Quiz API Response:');
      console.log(JSON.stringify(result, null, 2));

      if (result.success && result.data) {
        console.log('✅ Quiz Generated!');
        console.log('📝 Number of questions:', result.data.length);

        return result;
      } else {
        console.log('❌ Quiz Generation Failed - API returned success: false');
        throw new Error(result.message || 'Failed to generate quiz');
      }

    } catch (error) {
      console.error('💥 Quiz Generation Service Error:', error);

      let errorMessage = 'Failed to generate quiz. Please try again.';

      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage = 'Network connection failed. Please check your internet connection.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        message: errorMessage,
        data: [],
      };
    }
  }

  /**
   * Summarize a file
   */
  async summarizeFile(fileUri: string): Promise<SummarizationResult> {
    try {
      console.log('📄 File Summarization: Starting...');
      console.log('📎 File URI:', fileUri);

      const apiEndpoint = `${this.baseUrl}${this.summarizationEndpoint}`;
      console.log('📡 Summarization API Endpoint:', apiEndpoint);

      // Create form data for the API request
      const formData = new FormData();

      // Get the filename from the URI
      const filename = fileUri.split('/').pop() || 'uploaded_file';
      console.log('📄 Filename:', filename);

      // Add the file to form data
      formData.append('file', {
        uri: fileUri,
        type: 'application/octet-stream', // Generic file type
        name: filename,
      } as any);

      console.log('📡 Summarization API: Making request...');

      // Get authentication token
      const token = await authService.getToken();
      if (!token) {
        throw new Error('Authentication required. Please login first.');
      }

      const requestStartTime = Date.now();

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - let the browser set it with boundary
        },
      });

      const requestEndTime = Date.now();
      const requestDuration = requestEndTime - requestStartTime;

      console.log(`⏱️ Summarization API: Request completed in ${requestDuration}ms`);
      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = `Summarization API responded with status ${response.status}`;
        try {
          const errorResult = await response.json();
          console.error('❌ Summarization API Error Response:', errorResult);
          errorMessage = errorResult.message || errorMessage;
        } catch (parseError) {
          console.error('❌ Failed to parse error response as JSON:', parseError);
          const textResponse = await response.text();
          console.error('❌ Error response body:', textResponse.substring(0, 200));
          if (textResponse.includes('<html') || textResponse.includes('<!DOCTYPE')) {
            errorMessage = 'Authentication failed. Please login again.';
          }
        }
        throw new Error(errorMessage);
      }

      let result: SummarizationResult;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse success response as JSON:', parseError);
        const textResponse = await response.text();
        console.error('❌ Response body:', textResponse.substring(0, 200));
        throw new Error('Invalid response format from server');
      }

      console.log('🔍 Summarization API Response:');
      console.log(JSON.stringify(result, null, 2));

      if (result.success && result.data) {
        console.log('✅ File Summarized!');
        console.log('📝 Summary length:', result.data.length);

        return result;
      } else {
        console.log('❌ File Summarization Failed - API returned success: false');
        throw new Error(result.message || 'Failed to summarize file');
      }

    } catch (error) {
      console.error('💥 File Summarization Service Error:', error);

      let errorMessage = 'Failed to summarize file. Please try again.';

      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage = 'Network connection failed. Please check your internet connection.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again with a smaller file.';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        message: errorMessage,
        data: '',
      };
    }
  }

  /**
   * Generate demo text for testing purposes
   */
  generateDemoText(): OCRResult {
    const demoText = 'Reading is a complex cognitive process that involves decoding written symbols to derive meaning. It requires the coordination of visual processing, phonological awareness, and comprehension skills. For individuals with dyslexia, this process can be challenging, but with proper support and assistive technologies, reading can become more accessible and enjoyable.';

    return {
      success: true,
      text: demoText,
      text_length: demoText.length,
    };
  }

  /**
   * Validate text for processing
   */
  validateText(text: string): { valid: boolean; message?: string } {
    if (!text || text.trim().length === 0) {
      return { valid: false, message: 'No text provided for processing' };
    }

    if (text.length < 10) {
      return { valid: false, message: 'Text is too short for meaningful learning content' };
    }

    if (text.length > 5000) {
      return { valid: false, message: 'Text is too long. Please use a shorter excerpt.' };
    }

    return { valid: true };
  }

  /**
   * Parse markdown text and extract clean readable content
   */
  parseMarkdownText(markdownText: string): string {
    if (!markdownText) {return '';}

    let cleanText = markdownText;

    // Remove markdown image references: ![alt](url)
    cleanText = cleanText.replace(/!\[.*?\]\(.*?\)/g, '');

    // Remove markdown links but keep the text: [text](url) -> text
    cleanText = cleanText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    // Remove markdown headers: ## Header -> Header
    cleanText = cleanText.replace(/^#{1,6}\s*/gm, '');

    // Convert markdown bullet points to readable format
    cleanText = cleanText.replace(/^\s*[-*+]\s*/gm, '• ');

    // Remove excessive whitespace and newlines
    cleanText = cleanText.replace(/\n\s*\n/g, '\n'); // Multiple newlines to single
    cleanText = cleanText.replace(/\n/g, ' '); // Convert remaining newlines to spaces
    cleanText = cleanText.replace(/\s+/g, ' '); // Multiple spaces to single

    // Remove any remaining markdown syntax
    cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold text
    cleanText = cleanText.replace(/\*(.*?)\*/g, '$1'); // Italic text
    cleanText = cleanText.replace(/`(.*?)`/g, '$1'); // Inline code

    return cleanText.trim();
  }

  /**
   * Clean and prepare text for learning content generation
   */
  cleanText(text: string): string {
    // First parse markdown if present
    const parsedText = this.parseMarkdownText(text);

    return parsedText
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\w\s.,!?;:"'()-]/g, ''); // Remove special characters except common punctuation
  }
}

export const ocrService = new OCRService();

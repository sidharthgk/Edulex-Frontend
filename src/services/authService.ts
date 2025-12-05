import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';

const BASE_URL = API_CONFIG.EDULEX.BASE_URL;

// Types for authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name?: string;
  email: string;
  email_verified_at?: string;
  token?: string;
}

// New types for the user details API response
export interface Wallet {
  balance: string;
  decimal_places: number;
  holder: any;
  holder_id: number;
  holder_type: string;
  meta: any[];
  name: string;
  slug: string;
  uuid: string;
}

export interface DyslexiaProfile {
  id: number;
  user_id: number;
  verbal_test_text?: string;
  handwriting_test_text?: string;
  dictation_test_text?: string;
  quiz_test?: any[];
  results?: any[];
  dyslexia_personality_report?: string;
  self_improvement_prompts?: string;
}

export interface UserDetails {
  id: number;
  name: string;
  email: string;
  age?: number;
  wallet: Wallet;
  dyslexia_profile: DyslexiaProfile | null;
}

export interface UserDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserDetails;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User;
}

export interface ErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errors?: any;
}

// Dyslexia test result interfaces
export interface TestResult {
  test_type: string;
  score: number;
  max_score: number;
  percentage: number;
  level: string;
  notes: string;
}

export interface DyslexiaResultsRequest {
  results: TestResult[];
}

export interface DyslexiaResultsResponse {
  success: boolean;
  message: string;
  data: DyslexiaProfile;
}

// Token storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

class AuthService {
  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    includeAuth: boolean = false
  ): Promise<any> {
    try {
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (includeAuth) {
        const token = await this.getToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const config: RequestInit = {
        method,
        headers,
      };

      if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
      }

      console.log(`Making ${method} request to ${BASE_URL}${endpoint}`);
      console.log('Request headers:', headers);
      console.log('Request body:', body);

      const response = await fetch(`${BASE_URL}${endpoint}`, config);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        data = { message: 'Invalid server response' };
      }

      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        // Create a custom error with specific details
        const error = new Error() as any;
        error.status = response.status;
        error.statusCode = response.status;

        // Handle different types of errors with specific messages
        if (response.status === 401) {
          error.message = 'Invalid email or password. Please check your credentials and try again.';
          error.type = 'UNAUTHORIZED';
        } else if (response.status === 422) {
          // Handle validation errors with specific field messages
          if (data.errors && typeof data.errors === 'object') {
            // Get all validation errors
            const allErrors: string[] = [];
            Object.entries(data.errors).forEach(([_field, messages]) => {
              if (Array.isArray(messages)) {
                allErrors.push(...messages);
              }
            });

            // Use the first error message or fallback to general message
            error.message = allErrors[0] || data.message || 'Please check your input and try again.';
          } else {
            error.message = data.message || 'Please check your input and try again.';
          }
          error.type = 'VALIDATION_ERROR';
          error.errors = data.errors;
        } else if (response.status === 429) {
          error.message = 'Too many attempts. Please wait a moment before trying again.';
          error.type = 'RATE_LIMIT';
        } else if (response.status >= 500) {
          error.message = 'Server error. Please try again later.';
          error.type = 'SERVER_ERROR';
        } else {
          error.message = data.message || `Request failed with status ${response.status}`;
          error.type = 'API_ERROR';
        }

        error.data = data;
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error(`Error in ${method} ${endpoint}:`, error);

      // If it's a network error, provide a friendly message
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const networkError = new Error('Network error. Please check your internet connection.') as any;
        networkError.type = 'NETWORK_ERROR';
        throw networkError;
      }

      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.makeRequest('/api/login', 'POST', credentials);

    if (response.success && response.data) {
      console.log('🔐 Login successful, storing token and user data...');
      await this.setToken(response.data.token);
      await this.setUser(response.data);
      console.log('✅ Login data stored successfully');
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.makeRequest('/api/register', 'POST', userData);

    if (response.success && response.data) {
      console.log('🔐 Registration successful, storing token and user data...');
      await this.setToken(response.data.token);
      await this.setUser(response.data);
      console.log('✅ Registration data stored successfully');
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      // The logout endpoint might return empty response, handle it gracefully
      const response = await fetch(`${BASE_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${await this.getToken()}`,
        },
        body: JSON.stringify({}),
      });

      console.log('Logout response status:', response.status);

      // Don't try to parse JSON if response is empty or not JSON
      if (response.status === 200 || response.status === 204) {
        console.log('Logout successful on server');
      } else {
        console.log('Logout API returned non-success status:', response.status);
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      await this.clearAuthData();
      console.log('Local auth data cleared');
    }
  }

  async refreshToken(): Promise<string> {
    const currentToken = await this.getToken();
    if (!currentToken) {
      throw new Error('No token to refresh');
    }

    const response = await this.makeRequest('/api/refresh-token', 'POST', {
      current_token: currentToken,
    });

    if (response.success && response.data) {
      await this.setToken(response.data);
      return response.data;
    }

    throw new Error('Failed to refresh token');
  }

  async sendPasswordResetLink(email: string): Promise<{ status: string }> {
    const response = await this.makeRequest('/api/password-reset-link', 'POST', { email });
    return response;
  }

  async resetPassword(resetData: ResetPasswordRequest): Promise<{ status: string }> {
    const response = await this.makeRequest('/api/reset-password', 'POST', resetData);
    return response;
  }

  async getUserDetails(): Promise<UserDetails> {
    console.log('📄 Fetching user details (MOCK)...');
    // Mock user details
    const mockDetails: UserDetails = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      age: 10,
      wallet: {
        balance: '100.00',
        decimal_places: 2,
        holder: {},
        holder_id: 1,
        holder_type: 'user',
        meta: [],
        name: 'Test Wallet',
        slug: 'test-wallet',
        uuid: 'mock-wallet-uuid',
      },
      dyslexia_profile: null,
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockDetails;
  }

  async submitDyslexiaResults(resultsData: DyslexiaResultsRequest): Promise<DyslexiaResultsResponse> {
    console.log('📊 Submitting dyslexia test results (MOCK)...');
    console.log('Results data:', resultsData);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response
    return {
      success: true,
      message: 'Results submitted successfully (MOCK)',
      data: {
        id: 1,
        user_id: 1,
        verbal_test_text: 'Mock verbal result',
        handwriting_test_text: 'Mock handwriting result',
        dictation_test_text: 'Mock dictation result',
        quiz_test: [],
        results: [],
        dyslexia_personality_report: 'Based on the mock results, you are doing great!',
        self_improvement_prompts: 'Keep practicing reading aloud.',
      }
    };
  }

  // Utility function to format test results from GlobalState
  formatTestResults(globalState: any): TestResult[] {
    const results: TestResult[] = [];

    // Eye Tracking Test (video-based)
    if (globalState.videoUri) {
      const eyeTrackingScore = globalState.eyeTrackingScore || 0;
      results.push({
        test_type: 'eyeTracking',
        score: eyeTrackingScore,
        max_score: 15,
        percentage: Math.round((eyeTrackingScore / 15) * 100),
        level: eyeTrackingScore >= 12 ? 'Excellent' : eyeTrackingScore >= 8 ? 'Good' : eyeTrackingScore >= 5 ? 'Fair' : 'Needs Improvement',
        notes: `Eye tracking test completed with ${eyeTrackingScore}% indicators detected`,
      });
    }

    // Handwriting Test (photo-based)
    if (globalState.photoUri) {
      const handwritingScore = globalState.handwritingScore || 0;
      results.push({
        test_type: 'handwriting',
        score: handwritingScore,
        max_score: 15,
        percentage: Math.round((handwritingScore / 15) * 100),
        level: handwritingScore >= 12 ? 'Excellent' : handwritingScore >= 8 ? 'Good' : handwritingScore >= 5 ? 'Fair' : 'Needs Improvement',
        notes: `Handwriting analysis completed with ${handwritingScore}% indicators detected`,
      });
    }

    // Dictation Test
    if (globalState.dictationScore !== undefined) {
      const dictationScore = globalState.dictationScore || 0;
      results.push({
        test_type: 'dictation',
        score: dictationScore,
        max_score: 2,
        percentage: Math.round((dictationScore / 2) * 100),
        level: dictationScore === 2 ? 'Excellent' : dictationScore === 1 ? 'Good' : 'Needs Improvement',
        notes: `Dictation test completed with ${dictationScore} out of 2 correct responses`,
      });
    }

    // Quiz Test
    if (globalState.quizScore !== undefined) {
      const quizScore = globalState.quizScore || 0;
      results.push({
        test_type: 'quiz',
        score: quizScore,
        max_score: 5,
        percentage: Math.round((quizScore / 5) * 100),
        level: quizScore >= 4 ? 'Excellent' : quizScore >= 3 ? 'Good' : quizScore >= 2 ? 'Fair' : 'Needs Improvement',
        notes: `Dyslexia quiz completed with ${quizScore} out of 5 correct answers`,
      });
    }

    return results;
  }

  // Token and user management
  async setToken(token: string): Promise<void> {
    // Remove 'Bearer ' prefix if it exists
    const cleanToken = token.replace('Bearer ', '');
    await AsyncStorage.setItem(TOKEN_KEY, cleanToken);
    console.log('✅ Token stored successfully:', cleanToken.substring(0, 20) + '...');
  }

  async getToken(): Promise<string | null> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      console.log('✅ Token retrieved from storage:', token.substring(0, 20) + '...');
    } else {
      console.log('❌ No token found in storage');
    }
    return token;
  }

  async setUser(user: User): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async clearAuthData(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    const user = await this.getUser();
    const isAuth = !!(token && user);

    console.log('🔍 Authentication check:', {
      hasToken: !!token,
      hasUser: !!user,
      isAuthenticated: isAuth,
    });

    return isAuth;
  }

  // Auto token refresh utility
  async makeAuthenticatedRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<any> {
    try {
      return await this.makeRequest(endpoint, method, body, true);
    } catch (error: any) {
      // If token expired, try to refresh
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        try {
          await this.refreshToken();
          return await this.makeRequest(endpoint, method, body, true);
        } catch (refreshError) {
          // If refresh fails, logout user
          await this.clearAuthData();
          throw new Error('Session expired. Please login again.');
        }
      }
      throw error;
    }
  }
}

export default new AuthService();

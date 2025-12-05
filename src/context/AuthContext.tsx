import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { User, LoginRequest, RegisterRequest } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  sendPasswordResetLink: (email: string) => Promise<{ success: boolean; message: string }>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      // For mock auth, we just check if we have a token in storage
      // We don't need to validate it with the backend
      const token = await authService.getToken();

      if (token) {
        const userData = await authService.getUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token exists but no user data? weird, but let's clear it
          await authService.clearAuthData();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      // Mock login - accept any credentials
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: credentials.email,
        email_verified_at: new Date().toISOString(),
        token: 'mock-jwt-token',
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      await authService.setToken('mock-jwt-token');
      await authService.setUser(mockUser);

      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      // Mock registration - accept any data
      const mockUser: User = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: userData.name,
        email: userData.email,
        email_verified_at: new Date().toISOString(),
        token: 'mock-jwt-token',
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      await authService.setToken('mock-jwt-token');
      await authService.setUser(mockUser);

      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true, message: 'Registration successful' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Just clear local data
      await authService.clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const sendPasswordResetLink = async (email: string): Promise<{ success: boolean; message: string }> => {
    // Mock password reset
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Reset link sent (mock)' };
  };

  const refreshUserData = async (): Promise<void> => {
    try {
      const userData = await authService.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    sendPasswordResetLink,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
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
      const authenticated = await authService.isAuthenticated();
      
      if (authenticated) {
        const userData = await authService.getUser();
        setUser(userData);
        setIsAuthenticated(true);
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
      const response = await authService.login(credentials);
      
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please check your credentials.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle validation errors
      if (error.message?.includes('422') || error.errors) {
        let errorMessage = 'Registration failed. ';
        if (error.errors) {
          const errorArray = Object.values(error.errors).flat();
          errorMessage += errorArray.join(' ');
        } else {
          errorMessage += error.message;
        }
        return { success: false, message: errorMessage };
      }
      
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const sendPasswordResetLink = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await authService.sendPasswordResetLink(email);
      return { success: true, message: response.status };
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Handle validation errors
      if (error.message?.includes('422') || error.errors) {
        let errorMessage = 'Password reset failed. ';
        if (error.errors?.email) {
          errorMessage += error.errors.email.join(' ');
        } else {
          errorMessage += error.message;
        }
        return { success: false, message: errorMessage };
      }
      
      return { 
        success: false, 
        message: error.message || 'Failed to send password reset link.' 
      };
    }
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
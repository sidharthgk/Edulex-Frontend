export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    card: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export const lightTheme: Theme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    primary: '#3DB2FF',
    secondary: '#4CAF50',
    accent: '#9C27B0',
    text: '#333333',
    textSecondary: '#666666',
    textMuted: '#999999',
    border: '#E0E0E0',
    card: '#FFFFFF',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#FF6B6B',
    info: '#2196F3',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
};

export const darkTheme: Theme = {
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#3DB2FF',
    secondary: '#4CAF50',
    accent: '#9C27B0',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textMuted: '#666666',
    border: '#333333',
    card: '#2C2C2C',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#FF6B6B',
    info: '#2196F3',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
}; 
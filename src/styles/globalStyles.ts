import { StyleSheet } from 'react-native';
import { Theme } from './themes';
import { SettingsState } from '../context/SettingsContext';

export const createGlobalStyles = (theme: Theme, settings: SettingsState) => {
  const fontSizes = {
    small: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 22,
    },
    medium: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 22,
      xxxl: 24,
    },
    large: {
      xs: 14,
      sm: 16,
      md: 18,
      lg: 20,
      xl: 22,
      xxl: 24,
      xxxl: 26,
    },
  };

  const currentFontSizes = fontSizes[settings.fontSize];
  const fontFamily = settings.dyslexicFontEnabled ? 'OpenDyslexic-Regular' : 'System';
  const boldFontFamily = settings.dyslexicFontEnabled ? 'OpenDyslexic-Bold' : 'System';
  const italicFontFamily = settings.dyslexicFontEnabled ? 'OpenDyslexic-Italic' : 'System';

  return StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      backgroundColor: theme.colors.background,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      shadowColor: theme.colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: settings.highContrastMode ? 2 : 0,
      borderColor: settings.highContrastMode ? theme.colors.primary : 'transparent',
    },
    surface: {
      backgroundColor: theme.colors.surface,
    },

    // Text styles
    text: {
      fontFamily,
      fontSize: currentFontSizes.md,
      color: theme.colors.text,
    },
    textBold: {
      fontFamily: boldFontFamily,
      fontSize: currentFontSizes.md,
      color: theme.colors.text,
    },
    textItalic: {
      fontFamily: italicFontFamily,
      fontSize: currentFontSizes.md,
      color: theme.colors.text,
    },
    textSecondary: {
      fontFamily,
      fontSize: currentFontSizes.sm,
      color: theme.colors.textSecondary,
    },
    textMuted: {
      fontFamily,
      fontSize: currentFontSizes.sm,
      color: theme.colors.textMuted,
    },
    textPrimary: {
      fontFamily: boldFontFamily,
      fontSize: currentFontSizes.md,
      color: theme.colors.primary,
    },

    // Heading styles
    h1: {
      fontFamily: boldFontFamily,
      fontSize: currentFontSizes.xxxl,
      color: theme.colors.text,
      lineHeight: currentFontSizes.xxxl * 1.2,
    },
    h2: {
      fontFamily: boldFontFamily,
      fontSize: currentFontSizes.xxl,
      color: theme.colors.text,
      lineHeight: currentFontSizes.xxl * 1.2,
    },
    h3: {
      fontFamily: boldFontFamily,
      fontSize: currentFontSizes.xl,
      color: theme.colors.text,
      lineHeight: currentFontSizes.xl * 1.2,
    },
    h4: {
      fontFamily: boldFontFamily,
      fontSize: currentFontSizes.lg,
      color: theme.colors.text,
      lineHeight: currentFontSizes.lg * 1.2,
    },

    // Header styles
    header: {
      backgroundColor: theme.colors.surface,
      paddingBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontFamily: boldFontFamily,
      fontSize: currentFontSizes.xl,
      color: theme.colors.text,
      textAlign: 'center',
    },
    headerSubtitle: {
      fontFamily,
      fontSize: currentFontSizes.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },

    // Button styles
    primaryButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    primaryButtonText: {
      fontFamily: boldFontFamily,
      fontSize: currentFontSizes.md,
      color: '#FFFFFF',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
    },
    secondaryButtonText: {
      fontFamily: boldFontFamily,
      fontSize: currentFontSizes.md,
      color: theme.colors.primary,
    },

    // Input styles
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: currentFontSizes.md,
      fontFamily,
      color: theme.colors.text,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    inputFocused: {
      borderColor: theme.colors.primary,
    },

    // List styles
    listItem: {
      backgroundColor: theme.colors.card,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    listItemText: {
      fontFamily,
      fontSize: currentFontSizes.md,
      color: theme.colors.text,
      flex: 1,
    },

    // Section styles
    sectionTitle: {
      fontFamily: boldFontFamily,
      fontSize: currentFontSizes.lg,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    sectionContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },

    // Loading styles
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      fontFamily,
      fontSize: currentFontSizes.md,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },

    // Error styles
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
    },
    errorText: {
      fontFamily,
      fontSize: currentFontSizes.md,
      color: theme.colors.error,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },

    // Alert styles
    alertSuccess: {
      backgroundColor: theme.colors.success,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    alertWarning: {
      backgroundColor: theme.colors.warning,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    alertError: {
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    alertText: {
      fontFamily,
      fontSize: currentFontSizes.md,
      color: '#FFFFFF',
    },

    // Common legacy styles for easy migration
    selectionTitle: {
      fontFamily: boldFontFamily,
      fontSize: currentFontSizes.lg,
      color: theme.colors.text,
    },
    selectionDescription: {
      fontFamily,
      fontSize: currentFontSizes.sm,
      color: theme.colors.textSecondary,
    },
    processButtonText: {
      fontFamily: boldFontFamily,
      fontSize: currentFontSizes.md,
      color: '#FFFFFF',
    },
    processingText: {
      fontFamily,
      fontSize: currentFontSizes.md,
      color: theme.colors.textSecondary,
    },
    questionText: {
      fontFamily,
      fontSize: currentFontSizes.lg,
      color: theme.colors.text,
    },
    optionText: {
      fontFamily,
      fontSize: currentFontSizes.md,
      color: theme.colors.text,
    },
    instructionText: {
      fontFamily,
      fontSize: currentFontSizes.sm,
      color: theme.colors.textSecondary,
    },
    title: {
      fontFamily: boldFontFamily,
      fontSize: currentFontSizes.xl,
      color: theme.colors.text,
    },
    subtitle: {
      fontFamily,
      fontSize: currentFontSizes.md,
      color: theme.colors.textSecondary,
    },
    scannedText: {
      fontFamily,
      fontSize: currentFontSizes.md,
      color: theme.colors.text,
      lineHeight: currentFontSizes.md * 1.4,
    },
  });
};

export default createGlobalStyles; 
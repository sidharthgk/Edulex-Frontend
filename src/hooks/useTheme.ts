import { useSettings } from '../context/SettingsContext';
import { lightTheme, darkTheme, Theme } from '../styles/themes';

export const useTheme = (): Theme => {
  const { settings } = useSettings();
  
  return settings.darkModeEnabled ? darkTheme : lightTheme;
}; 
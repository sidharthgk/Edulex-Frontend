import { useSettings } from '../context/SettingsContext';
import { useTheme } from './useTheme';
import { createGlobalStyles } from '../styles/globalStyles';

export const useAppStyles = () => {
  const { settings } = useSettings();
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme, settings);

  return {
    theme,
    settings,
    styles: globalStyles,
  };
};

export default useAppStyles; 
import React from 'react';
import { Text, TextProps } from 'react-native';
import { useSettings } from '../context/SettingsContext';

interface DyslexicTextProps extends TextProps {
  children: React.ReactNode;
}

export const DyslexicText: React.FC<DyslexicTextProps> = ({ children, style, ...props }) => {
  const { settings } = useSettings();
  
  const fontFamily = settings.dyslexicFontEnabled 
    ? 'OpenDyslexic-Regular' 
    : 'System';
  
  return (
    <Text 
      style={[{ fontFamily }, style]} 
      {...props}
    >
      {children}
    </Text>
  );
};

export default DyslexicText; 
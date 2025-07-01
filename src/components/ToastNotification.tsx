import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

interface ToastNotificationProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onHide?: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
  });

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconName: 'checkmark-circle' as const,
          iconColor: '#FFFFFF',
          backgroundColor: '#4CAF50',
        };
      case 'error':
        return {
          iconName: 'alert-circle' as const,
          iconColor: '#FFFFFF',
          backgroundColor: '#F44336',
        };
      case 'warning':
        return {
          iconName: 'warning' as const,
          iconColor: '#FFFFFF',
          backgroundColor: '#FF9800',
        };
      default:
        return {
          iconName: 'information-circle' as const,
          iconColor: '#FFFFFF',
          backgroundColor: '#3DB2FF',
        };
    }
  };

  const typeStyles = getTypeStyles();

  useEffect(() => {
    if (visible) {
      // Vibrate on show
      if (type === 'success') {
        Vibration.vibrate(100);
      } else if (type === 'error') {
        Vibration.vibrate([100, 50, 100]);
      } else {
        Vibration.vibrate(50);
      }

      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, slideAnim, duration, onHide, type]);

  if (!fontsLoaded || !visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: typeStyles.backgroundColor,
        },
      ]}
    >
      <Ionicons 
        name={typeStyles.iconName} 
        size={24} 
        color={typeStyles.iconColor} 
      />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
});

export default ToastNotification; 
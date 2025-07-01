import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

interface DyslexicAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const DyslexicAlert: React.FC<DyslexicAlertProps> = ({
  visible,
  title,
  message,
  type = 'info',
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
}) => {
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
          iconColor: '#4CAF50',
          borderColor: '#4CAF50',
          backgroundColor: '#E8F5E8',
        };
      case 'error':
        return {
          iconName: 'alert-circle' as const,
          iconColor: '#F44336',
          borderColor: '#F44336',
          backgroundColor: '#FFEBEE',
        };
      case 'warning':
        return {
          iconName: 'warning' as const,
          iconColor: '#FF9800',
          borderColor: '#FF9800',
          backgroundColor: '#FFF3E0',
        };
      default:
        return {
          iconName: 'information-circle' as const,
          iconColor: '#3DB2FF',
          borderColor: '#3DB2FF',
          backgroundColor: '#E3F2FD',
        };
    }
  };

  const typeStyles = getTypeStyles();

  const handleConfirm = () => {
    Vibration.vibrate(50);
    onConfirm?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  if (!fontsLoaded || !visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.alertContainer,
          { 
            backgroundColor: typeStyles.backgroundColor,
            borderColor: typeStyles.borderColor 
          }
        ]}>
          {/* Header with Icon */}
          <View style={styles.header}>
            <Ionicons 
              name={typeStyles.iconName} 
              size={32} 
              color={typeStyles.iconColor} 
            />
            <Text style={[styles.title, { color: typeStyles.iconColor }]}>
              {title}
            </Text>
          </View>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: typeStyles.iconColor }
              ]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertContainer: {
    borderRadius: 20,
    padding: 25,
    maxWidth: 350,
    width: '100%',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontFamily: 'OpenDyslexic-Bold',
    marginLeft: 12,
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333333',
    lineHeight: 24,
    marginBottom: 25,
    textAlign: 'left',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#3DB2FF',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Bold',
  },
});

export default DyslexicAlert; 
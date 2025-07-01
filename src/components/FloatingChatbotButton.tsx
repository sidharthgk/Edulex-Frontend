import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  View,
  Linking,
  Modal,
  Text,            // For custom text in modal
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../GlobalState';
import { useFonts } from 'expo-font';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const chatbotIcon = require('../../assets/chatboticon.png');

const FloatingChatbotButton: React.FC = () => {
  const { toggleChatbot } = useContext(GlobalContext);
  const insets = useSafeAreaInsets();

  // Track whether the main FAB menu is open or closed
  const [menuOpen, setMenuOpen] = useState(false);

  // Track whether we are showing the custom call confirm modal
  const [showCallConfirm, setShowCallConfirm] = useState(false);

  // Animated value: 0 (closed) to 1 (open)
  const [animationValue] = useState(new Animated.Value(0));

  // Load dyslexic fonts
  const [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    // If fonts not loaded yet, return null or a loading indicator
    return null;
  }

  // Animate the sub-buttons in or out
  const handleMenuToggle = () => {
    Animated.timing(animationValue, {
      toValue: menuOpen ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      // After animation, flip the boolean
      setMenuOpen(!menuOpen);
    });
  };

  // Sub-button positions
  const chatbotTranslateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70],
  });
  const phoneTranslateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -140],
  });

  // Scale the menu icon from 1 to 1.2
  const menuScale = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  // ----------- PHONE ICON PRESS -----------
  const handlePhonePress = () => {
    // Show the custom confirmation modal
    setShowCallConfirm(true);
  };

  // If user confirms the call, open dialer with the number
  const confirmCall = () => {
    Linking.openURL('tel:+918086003644');
    setShowCallConfirm(false);
    handleMenuToggle(); // Also close the FAB menu
  };

  const cancelCall = () => {
    setShowCallConfirm(false);
  };

  // ----------- CHATBOT ICON PRESS -----------
  const handleChatbotPress = () => {
    toggleChatbot(true);
    handleMenuToggle();
  };

  return (
    <View style={[styles.container, { bottom: insets.bottom + 140 }]} pointerEvents="box-none">
      {/*
        If menu is open, show a transparent overlay behind the FAB.
        Tapping it closes the menu.
      */}
      {menuOpen && (
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={handleMenuToggle}
          activeOpacity={1}
        />
      )}

      {/* PHONE Sub-Button */}
      <Animated.View
        style={[
          styles.subButtonContainer,
          { transform: [{ translateY: phoneTranslateY }] },
        ]}
      >
        <TouchableOpacity
          style={styles.subButton}
          onPress={handlePhonePress}
          activeOpacity={0.8}
        >
          <Ionicons name="call-outline" size={24} color="#333" />
        </TouchableOpacity>
      </Animated.View>

      {/* CHATBOT Sub-Button */}
      <Animated.View
        style={[
          styles.subButtonContainer,
          { transform: [{ translateY: chatbotTranslateY }] },
        ]}
      >
        <TouchableOpacity
          style={styles.subButton}
          onPress={handleChatbotPress}
          activeOpacity={0.8}
        >
          <Image source={chatbotIcon} style={styles.subButtonIcon} />
        </TouchableOpacity>
      </Animated.View>

      {/* MAIN FAB (scaled Ionicon menu) */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleMenuToggle}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale: menuScale }] }}>
          <Ionicons name="menu" size={24} color="#333" />
        </Animated.View>
      </TouchableOpacity>

      {/*
        CALL CONFIRMATION MODAL:
        - We use a custom Modal so we can style text with OpenDyslexic font.
        - If user presses outside, they can close it or press Cancel or Yes.
      */}
      <Modal visible={showCallConfirm} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={cancelCall}>
          <View style={styles.modalBackground}>
            {/* Tapping outside the box closes the modal */}
            <TouchableWithoutFeedback onPress={() => { /* do nothing */ }}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Call Helpline?</Text>
                <Text style={styles.modalMessage}>
                  Are you sure you want to call our helpline?
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#aaa' }]}
                    onPress={cancelCall}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#3DB2FF' }]}
                    onPress={confirmCall}
                  >
                    <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default FloatingChatbotButton;

// ------------------ STYLING -------------------
const BUTTON_SIZE = 64;
const SUB_BUTTON_SIZE = 52;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    zIndex: 1000,
  },
  floatingButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonInactive: {
    backgroundColor: '#F5F5F5',
  },
  buttonActive: {
    backgroundColor: '#3DB2FF',
  },
  buttonIcon: {
    color: '#333',
  },
  // Typing indicator styles
  typingIndicator: {
    position: 'absolute',
    bottom: 80,
    right: 0,
    backgroundColor: '#2C3E50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    opacity: 0,
    transform: [{ scale: 0.8 }, { translateY: 10 }],
  },
  typingVisible: {
    opacity: 1,
    transform: [{ scale: 1 }, { translateY: 0 }],
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    opacity: 0.5,
  },
  typingActive: {
    opacity: 1,
  },
  subButtonContainer: {
    position: 'absolute',
    bottom: 0,
    right: (BUTTON_SIZE - SUB_BUTTON_SIZE) / 2,
    zIndex: 10,
  },
  subButton: {
    width: SUB_BUTTON_SIZE,
    height: SUB_BUTTON_SIZE,
    borderRadius: SUB_BUTTON_SIZE / 2,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  subButtonIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },

  // Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    marginHorizontal: 30,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontFamily: 'OpenDyslexic-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalButtonText: {
    fontFamily: 'OpenDyslexic-Bold',
    fontSize: 16,
  },
});

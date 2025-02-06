// src/chatbot/chatbot.tsx

import React, { useState, useRef, useContext } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../GlobalState';

interface ChatbotProps {
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const { state } = useContext(GlobalContext);
  // e.g. state.currentRoute = 'DictationTestInstructions' or 'EyeTrackingTest', etc.

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [fontsLoaded] = useFonts({
    'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
    'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
    'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  // Convert local messages to structure the server expects
  function buildChatHistory(msgs: Message[]) {
    return msgs.map((m) => ({
      role: m.isBot ? 'assistant' : 'user',
      content: m.text,
    }));
  }

  // Decide which testType based on route
  function mapRouteNameToTestType(routeName: string) {
    if (['DyslexiaTestInstructions', 'EyeTrackingTest'].includes(routeName)) {
      return 'eye-tracking';
    }
    if (['WritingTest', 'PhotoCamera'].includes(routeName)) {
      return 'handwriting';
    }
    if (['DictationTestInstructions', 'DictationTest'].includes(routeName)) {
      return 'dictation';
    }
    if (['DyslexiaQuizInstructions', 'DyslexiaQuiz'].includes(routeName)) {
      return 'quiz';
    }
    return 'ask';
  }

  // Return the correct endpoint
  function getEndpoint(testType: string) {
    switch (testType) {
      case 'eye-tracking':
        return 'https://chatbot.edulex.space/eye-tracking';
      case 'handwriting':
        return 'https://chatbot.edulex.space/handwriting';
      case 'dictation':
        return 'https://chatbot.edulex.space/dictation';
      case 'quiz':
        return 'https://chatbot.edulex.space/quiz';
      default:
        return 'https://chatbot.edulex.space/ask'; // fallback for general
    }
  }

  const handleSend = async () => {
    if (!inputText.trim()) {
      return;
    }

    // Add user message to local state
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      text: inputText,
      isBot: false,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    const userText = inputText;
    setInputText('');
    scrollToBottom();

    // Then fetch from server
    try {
      const testType = mapRouteNameToTestType(state.currentRoute);
      const endpoint = getEndpoint(testType);

      const requestBody = {
        chat_history: buildChatHistory([...messages, newMessage]),
        user_input: userText,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.chat_history || !Array.isArray(data.chat_history)) {
        throw new Error('Server response missing chat_history array');
      }

      const lastItem = data.chat_history[data.chat_history.length - 1];
      if (lastItem?.role !== 'assistant') {
        throw new Error('No assistant reply in chat_history');
      }

      // Add the bot's message to local state
      const botReply: Message = {
        id: `${Date.now()}-${Math.random()}`,
        text: lastItem.content,
        isBot: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botReply]);
      scrollToBottom();
    } catch (err) {
      console.error('Error fetching chatbot reply:', err);
      const errorMsg: Message = {
        id: `${Date.now()}-${Math.random()}`,
        text: 'Sorry, something went wrong. Please try again later.',
        isBot: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      scrollToBottom();
    }
  };

  function scrollToBottom() {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }

  // UI actions
  const handleMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const clearChat = () => {
    Alert.alert('Clear Chat', 'Are you sure you want to delete all messages?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes, Clear', onPress: () => setMessages([]) },
    ]);
    closeMenu();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    closeMenu();
  };

  const exportChat = () => {
    Alert.alert('Export Chat', 'Chat history has been saved (Mocked Feature)');
    closeMenu();
  };

  const renderMessage = (msg: Message) => {
    const isBot = msg.isBot;
    return (
      <View
        key={msg.id}
        style={[
          styles.messageBubble,
          isBot ? styles.botMessage : styles.userMessage,
          darkMode && (isBot ? styles.darkBotBubble : styles.darkUserBubble),
        ]}
      >
        <Text style={[styles.messageText, isBot && styles.botMessageText]}>
          {msg.text}
        </Text>
        {msg.timestamp && (
          <Text style={[styles.timestampText, isBot && styles.botTimestampText]}>
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      {/* Top-level wrapper to ensure flex layout */}
      <View style={{ flex: 1 }}>
        {/* KeyboardAvoidingView helps the UI adjust when the keyboard shows */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.container, darkMode && styles.darkContainer]}>
            <StatusBar
              barStyle={darkMode ? 'light-content' : 'dark-content'}
              backgroundColor={darkMode ? '#333' : '#2C3E50'}
            />

            {/* Header */}
            <View style={[styles.header, darkMode && styles.darkHeader]}>
              <View style={styles.headerContent}>
                <TouchableOpacity style={styles.backButton} onPress={onClose}>
                  <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                  <Text style={styles.headerTitle}>AI Mentor</Text>
                  <View style={styles.statusContainer}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Online</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.menuButton} onPress={handleMenu}>
                  <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={scrollToBottom}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContentContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {messages.map(renderMessage)}
            </ScrollView>

            {/* Input */}
            <View style={[styles.inputContainer, darkMode && styles.darkInput]}>
              <TextInput
                style={[styles.input, darkMode && styles.darkInputText]}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor={darkMode ? '#aaa' : '#888'}
                onFocus={scrollToBottom}
              />
              <TouchableOpacity
                style={[styles.sendButton, darkMode && styles.darkSendButton]}
                onPress={handleSend}
                activeOpacity={0.7}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Menu Modal */}
        <Modal
          transparent
          visible={menuVisible}
          animationType="slide"
          onRequestClose={closeMenu}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={closeMenu}
            activeOpacity={1}
          >
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={clearChat}>
                <Text style={styles.menuText}>Clear Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={exportChat}>
                <Text style={styles.menuText}>Export Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={toggleDarkMode}>
                <Text style={styles.menuText}>
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Text style={styles.menuText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </Modal>
  );
};

export default Chatbot;

/* ---- STYLES ---- */
const styles = StyleSheet.create({
  /* Container / General */
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7', // Soft light background
  },
  darkContainer: {
    backgroundColor: '#1E1E1E', // Dark background for dark mode
  },

  /* Header */
  header: {
    backgroundColor: '#2C3E50',
    paddingTop: Platform.OS === 'ios' ? 35 : 20,
    paddingBottom: 12,
    elevation: 5,
  },
  darkHeader: {
    backgroundColor: '#333',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'OpenDyslexic-Bold',
    fontSize: 22,
    color: '#fff',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2ECC71',
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 14,
    color: '#E8E8E8',
  },
  menuButton: {
    padding: 8,
  },

  /* Messages List */
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  messagesContentContainer: {
    paddingBottom: 16, // Slight bottom gap
  },

  /* Message Bubble */
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    marginVertical: 5,
    borderRadius: 16,
    // Subtle shadow for each bubble (light mode)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF', // Classic iOS blue for user
    borderTopRightRadius: 4, // Slightly different corner
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2C3E50', // Dark bubble for bot in light mode
    borderTopLeftRadius: 4,
  },
  darkUserBubble: {
    backgroundColor: '#0352C7', // Slightly darker blue for dark mode
  },
  darkBotBubble: {
    backgroundColor: '#444', // Darker bubble for dark mode
  },

  /* Message Text */
  messageText: {
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 16,
    color: '#fff', // Default text color on dark-ish backgrounds
  },
  botMessageText: {
    // For bot's bubble in light mode, it's already set to white text
    // If you prefer white bubble for bot, adjust colors accordingly
  },

  /* Timestamps */
  timestampText: {
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  botTimestampText: {
    // same color for bot; you can change if you prefer a different shade
  },

  /* Input Section */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: Platform.OS === 'ios' ? 16 : 10,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 6,
    // Light shadow for input container
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  darkInput: {
    backgroundColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
    color: '#333', // Dark text in light mode
  },
  darkInputText: {
    color: '#EEE', // Light text in dark mode
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#2C3E50',
    borderRadius: 20,
    marginLeft: 8,
  },
  darkSendButton: {
    backgroundColor: '#555',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    fontSize: 16,
  },

  /* Menu Modal */
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 50,
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

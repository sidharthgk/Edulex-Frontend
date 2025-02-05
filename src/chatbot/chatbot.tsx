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
    // 1) DyslexiaTestInstructions or EyeTrackingTest => "eye-tracking"
    if (['DyslexiaTestInstructions', 'EyeTrackingTest'].includes(routeName)) {
      return 'eye-tracking';
    }
    // 2) WritingTest or PhotoCamera => "handwriting"
    if (['WritingTest', 'PhotoCamera'].includes(routeName)) {
      return 'handwriting';
    }
    // 3) DictationTestInstructions or DictationTest => "dictation"
    if (['DictationTestInstructions', 'DictationTest'].includes(routeName)) {
      return 'dictation';
    }
    // 4) DyslexiaQuizInstructions or DyslexiaQuiz => "quiz"
    if (['DyslexiaQuizInstructions', 'DyslexiaQuiz'].includes(routeName)) {
      return 'quiz';
    }
    // 5) Everything else => "ask"
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

  const renderMessage = (msg: Message) => (
    <View
      key={msg.id}
      style={[
        styles.messageBubble,
        msg.isBot ? styles.botMessage : styles.userMessage,
      ]}
    >
      <Text style={styles.messageText}>{msg.text}</Text>
      {msg.timestamp && (
        <Text style={styles.timestampText}>
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      )}
    </View>
  );

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
            <StatusBar />

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
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#888"
                onFocus={scrollToBottom}
              />
              <TouchableOpacity
                style={styles.sendButton}
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
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  darkContainer: {
    backgroundColor: '#1E1E1E',
  },

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

  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  messagesContentContainer: {
    // Reduced bottom padding for less gap above input
    paddingBottom: 15,
  },

  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
    paddingHorizontal: 20,
    // Minimal or no shadow for a cleaner look:
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userMessage: {
    backgroundColor: '#3DB2FF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 3, // Slightly sharper corner
  },
  botMessage: {
    backgroundColor: '#2C3E50',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 3, // Slightly sharper corner
  },
  messageText: {
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 16,
    color: '#fff',
  },
  timestampText: {
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 6,
    // Light shadow for input container
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    fontFamily: 'OpenDyslexic-Regular',
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#2C3E50',
    borderRadius: 20,
    marginLeft: 6,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontFamily: 'OpenDyslexic-Bold',
    fontSize: 16,
  },

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
  },
});

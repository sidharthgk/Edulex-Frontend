import React, { useState, useRef } from 'react';
import {
    View,
    TextInput,
    ScrollView,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
    Alert,
} from 'react-native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

interface Message {
    id: string;
    text: string;
    isBot: boolean;
    timestamp?: string;
}

const Chatbot: React.FC = () => {
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

    const handleSend = () => {
        if (inputText.trim()) {
            const newMessage: Message = {
                id: `${Date.now()}-${Math.random()}`,
                text: inputText,
                isBot: false,
                timestamp: new Date().toISOString(),
            };
            setMessages([...messages, newMessage]);
            setInputText('');
            generateBotResponse(inputText);
            scrollToBottom();
        }
    };

    const generateBotResponse = (userInput: string) => {
        let botResponseText = 'This is a response from the bot.';
        if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
            botResponseText = 'Hello there!';
        }
        const botResponse: Message = {
            id: `${Date.now()}-${Math.random()}`,
            text: botResponseText,
            isBot: true,
            timestamp: new Date().toISOString(),
        };
        setTimeout(() => {
            setMessages((prevMessages) => [...prevMessages, botResponse]);
            scrollToBottom();
        }, 1000);
    };

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const handleMenu = () => {
        setMenuVisible(true);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    const clearChat = () => {
        Alert.alert(
            'Clear Chat',
            'Are you sure you want to delete all messages?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes, Clear', onPress: () => setMessages([]) },
            ]
        );
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

    const renderMessage = (message: Message) => (
        <View key={message.id} style={[styles.messageBubble, message.isBot ? styles.botMessage : styles.userMessage]}>
            <Text style={styles.messageText}>{message.text}</Text>
            {message.timestamp && (
                <Text style={styles.timestampText}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            )}
        </View>
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={[styles.container, darkMode && styles.darkContainer]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <StatusBar style="light" />
                <View style={[styles.header, darkMode && styles.darkHeader]}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity style={styles.backButton}>
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.headerCenter}>
                            <Text style={styles.headerTitle}>AI Assistant</Text>
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

                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={scrollToBottom}
                    style={styles.messagesContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    {messages.map(renderMessage)}
                </ScrollView>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        placeholderTextColor={'#888'}
                        accessibilityLabel="Message input"
                        onFocus={scrollToBottom}
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSend}
                        accessibilityLabel="Send button"
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>

                {/* Menu Modal */}
                <Modal
                    transparent={true}
                    visible={menuVisible}
                    animationType="slide"
                    onRequestClose={closeMenu}
                >
                    <TouchableWithoutFeedback onPress={closeMenu}>
                        <View style={styles.modalBackground}>
                            <View style={styles.menuContainer}>
                                <TouchableOpacity style={styles.menuItem} onPress={clearChat}>
                                    <Text style={styles.menuText}>Clear Chat</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuItem} onPress={exportChat}>
                                    <Text style={styles.menuText}>Export Chat</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuItem} onPress={toggleDarkMode}>
                                    <Text style={styles.menuText}>{darkMode ? 'Light Mode' : 'Dark Mode'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                                    <Text style={styles.menuText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

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
        paddingTop: Platform.OS === 'ios' ? 40 : 30,
        paddingBottom: 15,
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
        fontSize: 24,
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
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 20,
        marginVertical: 5,
        marginBottom: 15,
    },
    userMessage: {
        backgroundColor: '#3DB2FF',
        alignSelf: 'flex-end',
    },
    botMessage: {
        backgroundColor: '#2C3E50',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontFamily: 'OpenDyslexic-Regular',
        fontSize: 16,
        color: '#fff',
    },
    timestampText: {
        fontFamily: 'OpenDyslexic-Regular',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 30,
        marginHorizontal: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        fontFamily: 'OpenDyslexic-Regular',
    },
    sendButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#2C3E50',
        borderRadius: 20,
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

export default Chatbot;

import React, { useState, useRef } from 'react';
import { View, TextInput, ScrollView, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useFonts } from 'expo-font';

interface Message {
    id: string;
    text: string;
    isBot: boolean;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
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
            const newMessage: Message = { id: `${Date.now()}-${Math.random()}`, text: inputText, isBot: false };
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
        const botResponse: Message = { id: `${Date.now()}-${Math.random()}`, text: botResponseText, isBot: true };
        setTimeout(() => {
            setMessages((prevMessages) => [...prevMessages, botResponse]);
            scrollToBottom();
        }, 1000);
    };

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const renderMessage = (message: Message) => (
        <View key={message.id} style={[styles.messageBubble, message.isBot ? styles.botMessage : styles.userMessage]}>
            <Text style={styles.messageText}>{message.text}</Text>
        </View>
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.header}>
                    <Text style={styles.welcomeMessage}>AI Chatbot</Text>
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
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend} accessibilityLabel="Send button">
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    messagesContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 20,
        marginVertical: 5,
    },
    userMessage: {
        backgroundColor: '#3DB2FF',
        alignSelf: 'flex-end',
    },
    botMessage: {
        backgroundColor: '#FFA500',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontFamily: 'OpenDyslexic-Regular',
        fontSize: 18,
        color: '#fff',
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
        fontSize: 18,
        fontFamily: 'OpenDyslexic-Regular',
    },
    sendButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#3DB2FF',
        borderRadius: 20,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontFamily: 'OpenDyslexic-Bold',
        fontSize: 18,
    },
    header: {
        backgroundColor: '#3DB2FF',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    welcomeMessage: {
        fontFamily: 'OpenDyslexic-Bold',
        fontSize: 22,
        color: '#fff',
        marginTop: 20,
    },
});

export default Chatbot;

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
        }, 1000);
    };

    const renderMessage = (message: Message) => (
        <Text key={message.id} style={message.isBot ? styles.botMessage : styles.userMessage}>
            {message.text}
        </Text>
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.boxContainer}>
                    <Text style={styles.welcomeMessage}>AI Chatbot</Text>
                </View>
                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
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
                        placeholder="Type a message"
                        placeholderTextColor={'#888'}
                        accessibilityLabel="Message input"
                        onPress={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
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
        backgroundColor: '#fff',
    },
    messagesContainer: {
        flex: 1,
        padding: 25,
    },
    userMessage: {
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 20,
        marginVertical: 5,
        fontFamily: 'OpenDyslexic-Regular',
        fontSize: 20,
        color: '#3DB2FF',
        alignSelf: 'flex-end',
    },
    botMessage: {
        padding: 10,
        backgroundColor: '#e1e1e1',
        borderRadius: 20,
        marginVertical: 5,
        fontFamily: 'OpenDyslexic-Regular',
        fontSize: 20,
        color: '#FF5733',
        alignSelf: 'flex-start',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        fontFamily: 'OpenDyslexic-Regular',
        fontSize: 20,
    },
    sendButton: {
        padding: 12,
        backgroundColor: '#3DB2FF',
        borderRadius: 15,
        alignItems: 'center',
        marginLeft: 10,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontFamily: 'OpenDyslexic-Bold',
        fontSize: 20,
    },
    boxContainer: {
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    welcomeMessage: {
        fontFamily: 'OpenDyslexic-Bold',
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 5,
        marginTop: 40,
        color: '#3DB2FF',
    },
});

export default Chatbot;

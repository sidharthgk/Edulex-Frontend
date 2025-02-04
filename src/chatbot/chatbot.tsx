import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';

const Chatbot = () => {
    const [messages, setMessages] = useState<{ id: string; text: string; isBot: boolean }[]>([]);
    const [inputText, setInputText] = useState('');

    let [fontsLoaded] = useFonts({
        'OpenDyslexic-Regular': require('../../assets/fonts/OpenDyslexic-Regular.otf'),
        'OpenDyslexic-Bold': require('../../assets/fonts/OpenDyslexic-Bold.otf'),
        'OpenDyslexic-Italic': require('../../assets/fonts/OpenDyslexic-Italic.otf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    const handleSend = () => {
        if (inputText.trim()) {
            const newMessage = { id: Date.now().toString(), text: inputText, isBot: false };
            setMessages([...messages, newMessage]);
            setInputText('');
            setTimeout(() => {
                const botResponse = { id: Date.now().toString(), text: 'This is a response from the bot.', isBot: true };
                setMessages((prevMessages) => [...prevMessages, botResponse]);
            }, 1000);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Text style={item.isBot ? styles.botMessage : styles.userMessage}>{item.text}</Text>
                )}
            />
            <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: '#fff',
    },
    userMessage: {
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 5,
        marginVertical: 5,
        fontFamily: 'OpenDyslexic-Regular',
        fontSize: 20,
        color: '#3DB2FF',
        alignSelf: 'flex-end',
    },
    botMessage: {
        padding: 10,
        backgroundColor: '#e1e1e1',
        borderRadius: 5,
        marginVertical: 5,
        fontFamily: 'OpenDyslexic-Regular',
        fontSize: 20,
        color: '#FF5733',
        alignSelf: 'flex-start',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        fontFamily: 'OpenDyslexic-Regular',
        fontSize: 20,
    },
    sendButton: {
        padding: 12,
        backgroundColor: '#3DB2FF',
        borderRadius: 50,
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontFamily: 'OpenDyslexic-Bold',
        fontSize: 20,
    },
});

export default Chatbot;

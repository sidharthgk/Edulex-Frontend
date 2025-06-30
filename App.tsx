import React, { useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GlobalProvider, GlobalContext } from './src/GlobalState';
import AppNavigator from './src/navigation/AppNavigator';
import Chatbot from './src/chatbot/chatbot';
import FloatingChatbotButton from './src/components/FloatingChatbotButton';

const AppContent = () => {
  const { state, toggleChatbot } = useContext(GlobalContext);

  return (
    <>
      <AppNavigator />

      {/* The floating button is always visible on top of the navigator */}
      <FloatingChatbotButton />

      {/* Conditionally render the Chatbot if isChatbotVisible */}
      {state.isChatbotVisible && (
        <Chatbot onClose={() => toggleChatbot(false)} />
      )}
    </>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <GlobalProvider>
        <AppContent />
      </GlobalProvider>
    </SafeAreaProvider>
  );
};

export default App;

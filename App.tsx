import React, { useContext } from 'react';
import { GlobalProvider, GlobalContext } from './src/GlobalState';
import AppNavigator from './src/navigation/AppNavigator';
import Chatbot from './src/chatbot/chatbot';
import FloatingChatbotButton from './src/components/FloatingChatbotButton';
// ^ adjust path as needed

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
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
};

export default App;

import React, { createContext, useState, ReactNode, useContext } from 'react';

interface ChatbotContextType {
  isChatbotVisible: boolean;
  setIsChatbotVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChatbotContext = createContext<ChatbotContextType>({
  isChatbotVisible: false,
  setIsChatbotVisible: () => {},
});

export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  return (
    <ChatbotContext.Provider value={{ isChatbotVisible, setIsChatbotVisible }}>
      {children}
    </ChatbotContext.Provider>
  );
};

// Optional convenience hook
export const useChatbot = () => {
  return useContext(ChatbotContext);
};

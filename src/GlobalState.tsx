import React, { createContext, useState, ReactNode } from 'react';

interface RegistrationDetails {
  name: string;
  age: string;
  email: string;
  password: string;
}

interface GlobalState {
  photoUri: string;
  videoUri: string;
  dictationScore: number;
  quizScore: number;
  register: Array<RegistrationDetails>;
  taskID: number;
  /** New: track if chatbot is visible */
  isChatbotVisible: boolean;
}

interface GlobalContextProps {
  state: GlobalState;
  setState: React.Dispatch<React.SetStateAction<GlobalState>>;
  addRegistration: (registrationDetails: RegistrationDetails) => void;
  toggleChatbot: (visible?: boolean) => void;
}

const initialState: GlobalState = {
  photoUri: '',
  videoUri: '',
  dictationScore: 0,
  quizScore: 0,
  register: [],
  taskID: 0,
  isChatbotVisible: false,
};

export const GlobalContext = createContext<GlobalContextProps>({
  state: initialState,
  setState: () => {},
  addRegistration: () => {},
  toggleChatbot: () => {},
});

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [state, setState] = useState<GlobalState>(initialState);

  const addRegistration = (registrationDetails: RegistrationDetails) => {
    setState((prev) => ({
      ...prev,
      register: [...prev.register, registrationDetails],
    }));
  };

  const toggleChatbot = (visible?: boolean) => {
    setState((prev) => ({
      ...prev,
      isChatbotVisible:
        typeof visible === 'boolean' ? visible : !prev.isChatbotVisible,
    }));
  };

  return (
    <GlobalContext.Provider
      value={{
        state,
        setState,
        addRegistration,
        toggleChatbot,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// src/GlobalState.tsx
import React, { createContext, useState, ReactNode, useCallback } from 'react';

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
  isChatbotVisible: boolean;
  currentRoute: string; // new field
  isCameraCapturing: boolean; // new field to track camera capture mode
}

interface GlobalContextProps {
  state: GlobalState;
  setState: React.Dispatch<React.SetStateAction<GlobalState>>;
  addRegistration: (registrationDetails: RegistrationDetails) => void;
  toggleChatbot: (visible?: boolean) => void;
  setCameraCapturing: (capturing: boolean) => void;
}

const initialState: GlobalState = {
  photoUri: '',
  videoUri: '',
  dictationScore: 0,
  quizScore: 0,
  register: [],
  taskID: 0,
  isChatbotVisible: false,
  currentRoute: '', // start empty or 'SplashScreen'
  isCameraCapturing: false,
};

export const GlobalContext = createContext<GlobalContextProps>({
  state: initialState,
  setState: () => {},
  addRegistration: () => {},
  toggleChatbot: () => {},
  setCameraCapturing: () => {},
});

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [state, setState] = useState<GlobalState>(initialState);

  const addRegistration = useCallback((registrationDetails: RegistrationDetails) => {
    setState((prev) => ({
      ...prev,
      register: [...prev.register, registrationDetails],
    }));
  }, []);

  const toggleChatbot = useCallback((visible?: boolean) => {
    setState((prev) => ({
      ...prev,
      isChatbotVisible:
        typeof visible === 'boolean' ? visible : !prev.isChatbotVisible,
    }));
  }, []);

  const setCameraCapturing = useCallback((capturing: boolean) => {
    setState((prev) => ({
      ...prev,
      isCameraCapturing: capturing,
    }));
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        state,
        setState,
        addRegistration,
        toggleChatbot,
        setCameraCapturing,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

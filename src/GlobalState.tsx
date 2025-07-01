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
  eyeTrackingScore: number;
  handwritingScore: number;
  phoneticsProbability: number;
  register: Array<RegistrationDetails>;
  taskID: number;
  isChatbotVisible: boolean;
  currentRoute: string; // new field
  isCameraCapturing: boolean; // new field to track camera capture mode
  completedChapters: Set<string>; // new field to track completed chapters
}

interface GlobalContextProps {
  state: GlobalState;
  setState: React.Dispatch<React.SetStateAction<GlobalState>>;
  addRegistration: (registrationDetails: RegistrationDetails) => void;
  toggleChatbot: (visible?: boolean) => void;
  setCameraCapturing: (capturing: boolean) => void;
  markChapterComplete: (topicId: number, chapterId: number) => void;
  isChapterComplete: (topicId: number, chapterId: number) => boolean;
}

const initialState: GlobalState = {
  photoUri: '',
  videoUri: '',
  dictationScore: 0,
  quizScore: 0,
  eyeTrackingScore: 0,
  handwritingScore: 0,
  phoneticsProbability: 0,
  register: [],
  taskID: 0,
  isChatbotVisible: false,
  currentRoute: '', // start empty or 'SplashScreen'
  isCameraCapturing: false,
  completedChapters: new Set(),
};

export const GlobalContext = createContext<GlobalContextProps>({
  state: initialState,
  setState: () => {},
  addRegistration: () => {},
  toggleChatbot: () => {},
  setCameraCapturing: () => {},
  markChapterComplete: () => {},
  isChapterComplete: () => false,
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

  const markChapterComplete = useCallback((topicId: number, chapterId: number) => {
    setState((prev) => ({
      ...prev,
      completedChapters: new Set(prev.completedChapters).add(`${topicId}-${chapterId}`),
    }));
  }, []);

  const isChapterComplete = useCallback((topicId: number, chapterId: number) => {
    return state.completedChapters.has(`${topicId}-${chapterId}`);
  }, [state.completedChapters]);

  return (
    <GlobalContext.Provider
      value={{
        state,
        setState,
        addRegistration,
        toggleChatbot,
        setCameraCapturing,
        markChapterComplete,
        isChapterComplete,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

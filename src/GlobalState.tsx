// src/GlobalState.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface GlobalState {
    photoUri: string;
    videoUri: string;
    dictationScore: number;
    quizScore: number;
}

interface GlobalContextProps {
    state: GlobalState;
    setState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

const initialState: GlobalState = {
    photoUri: '',
    videoUri: '',
    dictationScore: 0,
    quizScore: 0,
};

export const GlobalContext = createContext<GlobalContextProps>({
    state: initialState,
    setState: () => {},
});

interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const [state, setState] = useState<GlobalState>(initialState);

    return (
        <GlobalContext.Provider value={{ state, setState }}>
            {children}
        </GlobalContext.Provider>
    );
};

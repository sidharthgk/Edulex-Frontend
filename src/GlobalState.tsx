// src/GlobalState.tsx
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
}

interface GlobalContextProps {
    state: GlobalState;
    setState: React.Dispatch<React.SetStateAction<GlobalState>>;
    addRegistration: (registrationDetails: RegistrationDetails) => void;
}

const initialState: GlobalState = {
    photoUri: '',
    videoUri: '',
    dictationScore: 0,
    quizScore: 0,
    register: [],
    taskID: 0,
};

export const GlobalContext = createContext<GlobalContextProps>({
    state: initialState,
    setState: () => {},
    addRegistration: () => {},
});

interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const [state, setState] = useState<GlobalState>(initialState);

    const addRegistration = (registrationDetails: RegistrationDetails) => {
        setState((prevState) => ({
            ...prevState,
            register: [...prevState.register, registrationDetails],
        }));
    };

    return (
        <GlobalContext.Provider value={{ state, setState, addRegistration }}>
            {children}
        </GlobalContext.Provider>
    );
};

// App.tsx
import React from 'react';
import { GlobalProvider } from './src/GlobalState';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
    return (
        <GlobalProvider>
            <AppNavigator />
        </GlobalProvider>
    );
};

export default App;

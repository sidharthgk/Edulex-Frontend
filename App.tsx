import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GlobalProvider } from './src/GlobalState';
import AppNavigator from './src/navigation/AppNavigator';
const AppContent = () => {
  return (
    <>
      <AppNavigator />

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

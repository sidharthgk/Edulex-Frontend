import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GlobalProvider } from './src/GlobalState';
import { AuthProvider } from './src/context/AuthContext';
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
      <AuthProvider>
        <GlobalProvider>
          <AppContent />
        </GlobalProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;

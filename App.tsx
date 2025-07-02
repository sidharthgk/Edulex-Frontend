import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GlobalProvider } from './src/GlobalState';
import { AuthProvider } from './src/context/AuthContext';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const { settings } = useSettings();
  
  return (
    <>
      <StatusBar 
        style={settings.darkModeEnabled ? "light" : "dark"} 
        backgroundColor={settings.darkModeEnabled ? "#121212" : "#FFFFFF"} 
      />
      <AppNavigator />
    </>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AuthProvider>
          <GlobalProvider>
            <AppContent />
          </GlobalProvider>
        </AuthProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
};

export default App;

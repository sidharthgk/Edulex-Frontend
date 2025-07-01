// src/navigation/AppNavigator.tsx
import React, { useContext } from 'react';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GlobalContext } from '../GlobalState';
import { useAuth } from '../context/AuthContext';

// Import Screens
import SplashScreen from '../screens/SplashScreen';
import StarterScreen from '../screens/StarterScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RegisterStart from '../screens/RegisterStart';
import SkipAssessmentConfirmation from '../screens/SkipAssessmentConfirmation';
import TabNavigator from './TabNavigator';

// Dyslexia Test Screens
import DyslexiaTestStart from '../screens/DyslexiaTest/DyslexiaTestStart';
import DyslexiaTestInstructions from '../screens/DyslexiaTest/DyslexiaTestInstructions';
import EyeTrackingTest from '../screens/DyslexiaTest/EyeTrackingTest';
import WritingTest from '../screens/DyslexiaTest/WritingTest';
import TestSubmitted from '../screens/DyslexiaTest/TestSubmitted';
import PhotoCamera from '../screens/DyslexiaTest/PhotoCamera';
import DyslexiaQuiz from '../screens/DyslexiaTest/DyslexiaQuiz';
import DyslexiaQuizInstructions from '../screens/DyslexiaTest/DyslexiaQuizInstructions';
import DictationTest from '../screens/DyslexiaTest/DictationTest';
import DictationTestInstructions from '../screens/DyslexiaTest/DictationTestInstructions';
import TestResult from '../screens/DyslexiaTest/TestResult';

// New Enhanced Screens
import ReadingAssistant from '../screens/ReadingAssistant';
import VocabularyBuilder from '../screens/VocabularyBuilder';
import TopicDetailScreen from '../screens/TopicDetailScreen';
import ChapterDetailScreen from '../screens/ChapterDetailScreen';

const Stack = createStackNavigator();

// Helper: recursively get the active route name
function getActiveRouteName(state: any): string {
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  return route.name;
}

const AppNavigator = () => {
  const { setState } = useContext(GlobalContext);
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3DB2FF" />
      </View>
    );
  }

  return (
    <NavigationContainer
      onStateChange={(state) => {
        if (state) {
          const currentRouteName = getActiveRouteName(state);
          // Store the route in global state
          setState((prev) => ({
            ...prev,
            currentRoute: currentRouteName,
          }));
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        initialRouteName={isAuthenticated ? 'TabNavigator' : 'SplashScreen'}
      >
        {/* Authentication Screens */}
        {!isAuthenticated && (
          <>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="StarterScreen" component={StarterScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="RegisterStart" component={RegisterStart} />
          </>
        )}
        
        {/* Main App Screens */}
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="SkipAssessmentConfirmation" component={SkipAssessmentConfirmation} />

        {/* Dyslexia Test Flow */}
        <Stack.Screen name="DyslexiaTestStart" component={DyslexiaTestStart} />
        <Stack.Screen name="DyslexiaTestInstructions" component={DyslexiaTestInstructions} />

        <Stack.Screen name="EyeTrackingTest" component={EyeTrackingTest} />
        <Stack.Screen name="WritingTest" component={WritingTest} />
        <Stack.Screen name="PhotoCamera" component={PhotoCamera} />
        <Stack.Screen name="DyslexiaQuiz" component={DyslexiaQuiz} />
        <Stack.Screen name="TestSubmitted" component={TestSubmitted} />
        <Stack.Screen name="DyslexiaQuizInstructions" component={DyslexiaQuizInstructions} />
        <Stack.Screen name="DictationTestInstructions" component={DictationTestInstructions} />
        <Stack.Screen name="DictationTest" component={DictationTest} />
        <Stack.Screen name="TestResult" component={TestResult} />
        
        {/* Enhanced Learning Screens */}
        <Stack.Screen name="ReadingAssistant" component={ReadingAssistant} />
        <Stack.Screen name="VocabularyBuilder" component={VocabularyBuilder} />
        <Stack.Screen name="TopicDetail" component={TopicDetailScreen} />
        <Stack.Screen name="ChapterDetail" component={ChapterDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default AppNavigator;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import SplashScreen from '../screens/SplashScreen';
import StarterScreen from '../screens/StarterScreen';
import LoginScreen from '../screens/LoginScreen';

// Import Register Screens
import RegisterStart from '../screens/Register/RegisterStart';
import RegisterAge from '../screens/Register/RegisterAge';
import RegisterName from '../screens/Register/RegisterName';
import RegisterEmail from '../screens/Register/RegisterEmail';
import RegisterPassword from '../screens/Register/RegisterPassword';

// Import Dyslexia Test Screens
import DyslexiaTestStart from '../screens/DyslexiaTest/DyslexiaTestStart';
import DyslexiaTestInstructions from '../screens/DyslexiaTest/DyslexiaTestInstructions';
import EyeTrackingTest from '../screens/DyslexiaTest/EyeTrackingTest';
import WritingTest from '../screens/DyslexiaTest/WritingTest';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Onboarding and Login Screens */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="StarterScreen" component={StarterScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />

        {/* Registration Flow */}
        <Stack.Screen name="RegisterStart" component={RegisterStart} />
        <Stack.Screen name="RegisterAge" component={RegisterAge} />
        <Stack.Screen name="RegisterName" component={RegisterName} />
        <Stack.Screen name="RegisterEmail" component={RegisterEmail} />
        <Stack.Screen name="RegisterPassword" component={RegisterPassword} />

        {/* Dyslexia Test Flow */}
        <Stack.Screen name="DyslexiaTestStart" component={DyslexiaTestStart} />
        <Stack.Screen
          name="DyslexiaTestInstructions"
          component={DyslexiaTestInstructions}
        />
        <Stack.Screen name="EyeTrackingTest" component={EyeTrackingTest} />
        <Stack.Screen name="WritingTest" component={WritingTest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

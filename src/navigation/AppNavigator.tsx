import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import StarterScreen from '../screens/StarterScreen';
import LoginScreen from '../screens/LoginScreen';

// Import Register Screens
import RegisterStart from '../screens/Register/RegisterStart';
import RegisterAge from '../screens/Register/RegisterAge';
import RegisterName from '../screens/Register/RegisterName';
import RegisterEmail from '../screens/Register/RegisterEmail';
import RegisterPassword from '../screens/Register/RegisterPassword';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="StarterScreen" component={StarterScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />

        {/* Registration Screens */}
        <Stack.Screen name="RegisterStart" component={RegisterStart} />
        <Stack.Screen name="RegisterAge" component={RegisterAge} />
        <Stack.Screen name="RegisterName" component={RegisterName} />
        <Stack.Screen name="RegisterEmail" component={RegisterEmail} />
        <Stack.Screen name="RegisterPassword" component={RegisterPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

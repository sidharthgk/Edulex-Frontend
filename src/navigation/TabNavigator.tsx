import React, { useContext, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalContext } from '../GlobalState';
import { useAppStyles } from '../hooks/useAppStyles';

// Import screens
import Dashboard from '../screens/Dashboard';
import MinigamesScreen from '../screens/MinigamesScreen';
import CameraScreen from '../screens/CameraScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Move CustomTabBarButton outside of the component to avoid recreation on every render
const CustomTabBarButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={styles.customTabButton}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={styles.customTabButtonInner}>
      {children}
    </View>
  </TouchableOpacity>
);

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const { state } = useContext(GlobalContext);
  const { theme } = useAppStyles();

  // Create stable icon functions using useCallback
  const HomeIcon = useCallback(({ color, size }: { color: string; size: number }) => (
    <Ionicons name="home-outline" size={size} color={color} />
  ), []);

  const LearnIcon = useCallback(({ color, size }: { color: string; size: number }) => (
    <Ionicons name="book-outline" size={size} color={color} />
  ), []);

  const CameraIcon = useCallback(({ focused: _focused }: { focused: boolean }) => (
    <Ionicons
      name="camera"
      size={35}
      color="#FFFFFF"
    />
  ), []);

  const CommunityIcon = useCallback(({ color, size }: { color: string; size: number }) => (
    <Ionicons name="people-outline" size={size} color={color} />
  ), []);

  const ProfileIcon = useCallback(({ color, size }: { color: string; size: number }) => (
    <Ionicons name="person-outline" size={size} color={color} />
  ), []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: state.isCameraCapturing
          ? { display: 'none' }
          : [styles.tabBar, { 
              paddingBottom: insets.bottom + 5, 
              backgroundColor: theme.colors.card,
              borderTopColor: theme.colors.border
            }],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          tabBarIcon: HomeIcon,
        }}
      />

      <Tab.Screen
        name="Learn"
        component={MinigamesScreen}
        options={{
          tabBarIcon: LearnIcon,
        }}
      />

      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: CameraIcon,
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarLabel: '',
        }}
      />

      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarIcon: CommunityIcon,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
   bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 95,
    paddingTop: 8,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderTopWidth: 0,
  },
  tabBarLabel: {
    fontFamily: 'OpenDyslexic-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  tabBarIcon: {
    marginTop: 8,
  },
  customTabButton: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTabButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#3DB2FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3DB2FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default TabNavigator;

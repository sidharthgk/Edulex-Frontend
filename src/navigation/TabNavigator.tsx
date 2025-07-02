import React, { useContext, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalContext } from '../GlobalState';

// Import screens
import Dashboard from '../screens/Dashboard';
import LearnScreen from '../screens/LearnScreen';
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
        tabBarActiveTintColor: '#3DB2FF',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: state.isCameraCapturing
          ? { display: 'none' }
          : [styles.tabBar, { paddingBottom: insets.bottom + 8 }],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarBackground: () => (
          <View style={styles.tabBarBackground} />
        ),
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
        component={LearnScreen}
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
    elevation: 12,
    height: 90,
    paddingTop: 12,
    paddingHorizontal: 10,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tabBarLabel: {
    fontFamily: 'OpenDyslexic-Bold',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  tabBarIcon: {
    marginTop: 6,
    marginBottom: 2,
  },
  customTabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: -5,
    zIndex: 10,
  },
  customTabButtonInner: {
    width: 70,
    height: 70,
    marginTop: 10,
    borderRadius: 35,
    backgroundColor: '#3DB2FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    shadowColor: '#3DB2FF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
});

export default TabNavigator;

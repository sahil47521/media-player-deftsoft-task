import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Mic, Video } from 'lucide-react-native';

import AudioScreen from '../screens/AudioScreen';
import VideoScreen from '../screens/VideoScreen';
import VideoDetailScreen from '../screens/VideoDetailScreen';
import { RootStackParamList, RootTabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

import { COLORS } from '../constants/variables';

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Audio') {
            return <Mic size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
          } else if (route.name === 'Video') {
            return <Video size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
          }
          return null;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        }
      })}
    >
      <Tab.Screen name="Audio" component={AudioScreen} />
      <Tab.Screen name="Video" component={VideoScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='Root' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="VideoPlayer" component={VideoDetailScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

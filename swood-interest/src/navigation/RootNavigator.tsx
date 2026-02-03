import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../types/navigation';

// Import des écrans
import { MapScreen } from '../screens/MapScreen';
import { ListScreen } from '../screens/ListScreen';

const Tab = createBottomTabNavigator<RootStackParamList>();

/**
 * RootNavigator - Configuration principale de la navigation
 * Utilise une Bottom Tab Navigation pour basculer entre Map et List
 */
export const RootNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: 'Carte',
          headerTitle: '🗺️ Carte',
          tabBarLabel: 'Carte',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🗺️</Text>
          ),
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
        }}
      />

      <Tab.Screen
        name="List"
        component={ListScreen}
        options={{
          title: 'Liste',
          headerTitle: '📋 Liste',
          tabBarLabel: 'Liste',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📋</Text>
          ),
          headerStyle: {
            backgroundColor: '#2196F3',
          },
        }}
      />
    </Tab.Navigator>
  );
};

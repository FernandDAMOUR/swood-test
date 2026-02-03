import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { MapScreen } from '../screens/MapScreen';
import { ListScreen } from '../screens/ListScreen';
import { RestaurantDetailScreen } from '../screens/RestaurantDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Stack pour la Carte
const MapStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={{
          headerTitle: 'Détails du restaurant',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

// Stack pour la Liste
const ListStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="List"
        component={ListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={{
          headerTitle: 'Détails du restaurant',
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

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
        component={MapStack}
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
        component={ListStack}
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
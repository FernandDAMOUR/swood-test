import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { RestaurantProvider } from './src/store/RestaurantContext';

export default function App() {
  return (
    <RestaurantProvider>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </RestaurantProvider>
  );
}

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant } from '../../types/restaurant';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurant }) => {
  return (
    <View style={styles.header}>
      <View style={styles.iconContainer}>
        <Ionicons name="restaurant" size={48} color="#007AFF" />
      </View>
      <Text style={styles.name}>{restaurant.name}</Text>
      {restaurant.cuisine && (
        <View style={styles.cuisineBadge}>
          <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  cuisineBadge: {
    backgroundColor: '#E1F5FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cuisineText: {
    color: '#0288D1',
    fontSize: 14,
    fontWeight: '600',
  },
});

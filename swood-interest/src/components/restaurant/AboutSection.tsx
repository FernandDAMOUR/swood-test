import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Restaurant } from '../../types/restaurant';

interface AboutSectionProps {
  restaurant: Restaurant;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ restaurant }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>À propos</Text>
      <View style={styles.aboutCard}>
        <Text style={styles.aboutText}>
          Découvrez {restaurant.name}, un restaurant{' '}
          {restaurant.cuisine ? `de cuisine ${restaurant.cuisine.toLowerCase()}` : ''} situé{' '}
          {restaurant.city ? `à ${restaurant.city}` : 'près de vous'}.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  aboutCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  aboutText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
});

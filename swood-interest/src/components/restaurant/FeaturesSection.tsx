import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const FeaturesSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Services</Text>
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Ionicons name="restaurant-outline" size={24} color="#007AFF" />
          <Text style={styles.featureText}>Sur place</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="bag-handle-outline" size={24} color="#007AFF" />
          <Text style={styles.featureText}>À emporter</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="bicycle-outline" size={24} color="#007AFF" />
          <Text style={styles.featureText}>Livraison</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="card-outline" size={24} color="#007AFF" />
          <Text style={styles.featureText}>Paiement CB</Text>
        </View>
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
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureItem: {
    width: '45%',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  featureText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});

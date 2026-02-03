import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant } from '../../types/restaurant';
import { getAddressFromCoordinates } from '../../helpers/geocodingHelpers';

interface InfoSectionProps {
  restaurant: Restaurant;
}

export const InfoSection: React.FC<InfoSectionProps> = ({ restaurant }) => {
  const [fullAddress, setFullAddress] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    fetchAddress();
  }, [restaurant.latitude, restaurant.longitude]);

  const fetchAddress = async () => {
    setLoadingAddress(true);
    const address = await getAddressFromCoordinates(
      restaurant.latitude,
      restaurant.longitude
    );
    setFullAddress(address);
    setLoadingAddress(false);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Informations</Text>

      <View style={styles.infoRow}>
        <Ionicons name="location" size={20} color="#666" />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Adresse complète</Text>
          {loadingAddress ? (
            <ActivityIndicator size="small" color="#007AFF" style={{ alignSelf: 'flex-start' }} />
          ) : (
            <Text style={styles.infoText}>
              {fullAddress || restaurant.address || 'Adresse non disponible'}
              {!fullAddress && restaurant.city ? `\n${restaurant.city}` : ''}
            </Text>
          )}
        </View>
      </View>

      {restaurant.phone && (
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoText}>{restaurant.phone}</Text>
          </View>
        </View>
      )}

      {restaurant.website && (
        <View style={styles.infoRow}>
          <Ionicons name="globe" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Site web</Text>
            <Text style={[styles.infoText, styles.link]} numberOfLines={1}>
              {restaurant.website}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={20} color="#666" />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Coordonnées GPS</Text>
          <Text style={styles.infoText}>
            {restaurant.latitude.toFixed(6)}, {restaurant.longitude.toFixed(6)}
          </Text>
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
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  link: {
    color: '#007AFF',
  },
});

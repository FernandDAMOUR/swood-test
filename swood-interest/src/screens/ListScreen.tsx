import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { useRestaurants } from '../hooks/useRestaurants';

export const ListScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission de localisation refusée');
        Alert.alert(
          'Permission refusée',
          'Nous avons besoin de votre permission pour accéder à votre localisation.'
        );
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const defaultRegion = {
    latitude: 48.8566,
    longitude: 2.3522,
  };

  const currentCoords = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
    : defaultRegion;

  const { restaurants, loading, error } = useRestaurants(
    currentCoords.latitude,
    currentCoords.longitude,
    1000
  );

  const renderRestaurantItem = ({ item }: { item: any }) => (
    <View style={styles.restaurantCard}>
      <Text style={styles.restaurantName}>🍽️ {item.name}</Text>
      {item.cuisine && (
        <Text style={styles.restaurantDetail}>Type: {item.cuisine}</Text>
      )}
      {item.address && (
        <Text style={styles.restaurantDetail}>📍 {item.address}</Text>
      )}
      {item.city && (
        <Text style={styles.restaurantDetail}>Ville: {item.city}</Text>
      )}
      {item.phone && (
        <Text style={styles.restaurantDetail}>📞 {item.phone}</Text>
      )}
      {item.website && (
        <Text style={styles.restaurantDetail}>🌐 {item.website}</Text>
      )}
      <Text style={styles.coordinates}>
        ({item.latitude.toFixed(4)}, {item.longitude.toFixed(4)})
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Liste des restaurants</Text>
        {restaurants.length > 0 && (
          <Text style={styles.count}>
            {restaurants.length} restaurant{restaurants.length > 1 ? 's' : ''} trouvé
            {restaurants.length > 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Chargement des restaurants...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ Erreur: {error}</Text>
        </View>
      )}

      {!loading && restaurants.length === 0 && !error && (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>Aucun restaurant trouvé</Text>
        </View>
      )}

      {!loading && restaurants.length > 0 && (
        <FlatList
          data={restaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  count: {
    fontSize: 14,
    color: '#e3f2fd',
    marginTop: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  noDataText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 10,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  restaurantDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  coordinates: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { useRestaurants } from '../hooks/useRestaurants';
import { useFavorites } from '../hooks/useFavorites';
import { Restaurant } from '../types/restaurant';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  MapMain: undefined;
  RestaurantDetail: { restaurant: Restaurant };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MapScreen = () => {
  console.log('--> [MAP_SCREEN] Rendering');
  
  const { restaurants, loading, error, location, refreshRestaurants } = useRestaurants();
  const { isFav } = useFavorites();
  const navigation = useNavigation<NavigationProp>();
  
  console.log(`--> [MAP_SCREEN] Found ${restaurants.length} restaurants`);

  const handleMarkerPress = (restaurant: Restaurant) => {
    console.log('--> [MAP_SCREEN] Marker pressed:', restaurant.name);
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  if (loading && !location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.text}>Acquisition de la position...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Localisation non disponible</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  console.log(`--> [MAP_SCREEN] Rendering map with ${restaurants.length} restaurants`);
  
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        provider={PROVIDER_GOOGLE}
      >
        {/* Cercle de 1km autour de la position */}
        <Circle
          center={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          radius={1000}
          fillColor="rgba(76, 175, 80, 0.1)"
          strokeColor="rgba(76, 175, 80, 0.5)"
          strokeWidth={2}
        />

        {/* Marqueurs des restaurants */}
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            }}
            pinColor={isFav(restaurant.id) ? "#FFD700" : "#FF6B6B"}
            onPress={() => handleMarkerPress(restaurant)}
            title={restaurant.name}
            description={restaurant.cuisine}
          />
        ))}
      </MapView>

      {/* Overlay d'informations en haut */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>📍 Votre position</Text>
        <Text style={styles.infoText}>
          {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
        </Text>
        <Text style={styles.restaurantCount}>
          🍽️ {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} à proximité
        </Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={refreshRestaurants}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? '⏳ Chargement...' : '🔄 Actualiser'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#4CAF50" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  infoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  restaurantCount: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
    marginBottom: 10,
  },
  refreshButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
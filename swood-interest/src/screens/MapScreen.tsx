import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRestaurants } from '../hooks/useRestaurants';

export const MapScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  useEffect(() => {
      (async () => {
          //localisation
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
    
    // Localisation par défaut 
    const defaultRegion = {
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };
    
    const mapRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    }
    : defaultRegion;
    
    const { restaurants, loading, error } = useRestaurants(mapRegion?.latitude, mapRegion?.longitude, 1000);
    console.log(`--> [MAP_SCREEN] Found ${restaurants.length} restaurants near (${mapRegion.latitude}, ${mapRegion.longitude})`);
    console.log(restaurants, "les fameux restuarant");
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        showsUserLocation
        showsMyLocationButton
        followsUserLocation
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Vous êtes ici"
            description="Votre position actuelle"
            pinColor="#4CAF50"
          />
        )}
        
        {/* Marqueurs des restaurants */}
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            }}
            title={restaurant.name}
            pinColor="#FF6B6B"
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{restaurant.name}</Text>
                {restaurant.cuisine && (
                  <Text style={styles.calloutText}>Type: {restaurant.cuisine}</Text>
                )}
                {restaurant.address && (
                  <Text style={styles.calloutText}>📍 {restaurant.address}</Text>
                )}
                {restaurant.city && (
                  <Text style={styles.calloutText}>{restaurant.city}</Text>
                )}
                {restaurant.phone && (
                  <Text style={styles.calloutText}>📞 {restaurant.phone}</Text>
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Affichage des coordonnées */}
      {location && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>📍 Votre position</Text>
          <Text style={styles.infoText}>
            Latitude: {location.coords.latitude.toFixed(6)}
          </Text>
          <Text style={styles.infoText}>
            Longitude: {location.coords.longitude.toFixed(6)}
          </Text>
          <Text style={styles.restaurantCount}>
            🍽️ {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} à proximité
          </Text>
        </View>
      )}

      {/* Affichage de l'erreur si permission refusée */}
      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
        </View>
      )}

      {/* Message de chargement */}
      {!location && !errorMsg && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>📡 Récupération de votre position...</Text>
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  restaurantCount: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  calloutContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    minWidth: 200,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  calloutText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  errorContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(244, 67, 54, 0.95)',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(33, 150, 243, 0.95)',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { Restaurant } from '../types/restaurant';
import { restaurantStore } from './restaurantStore';
import { getRestaurants } from '../services/restaurantService';
import { getCachedRestaurants, cacheRestaurants, saveLastLocation } from '../services/storageService';

interface RestaurantContextType {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  location: Location.LocationObject | null;
  refreshRestaurants: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

interface RestaurantProviderProps {
  children: ReactNode;
}

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({ children }) => {
  const [state, setState] = useState(restaurantStore.getState());
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    // S'abonner aux changements du store
    const unsubscribe = restaurantStore.subscribe((newState) => {
      setState(newState);
    });

    // Charger les restaurants au montage
    fetchRestaurants();

    return unsubscribe;
  }, []);

  const fetchRestaurants = async (forceRefresh: boolean = false) => {
    console.log('[RESTAURANT_CONTEXT] Fetching restaurants, forceRefresh:', forceRefresh);
    
    try {
      restaurantStore.setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        restaurantStore.setError("Permission de localisation refusée");
        Alert.alert(
          'Permission refusée',
          'Nous avons besoin de votre permission pour accéder à votre localisation.'
        );
        return;
      }

      // Obtenir la position actuelle
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const { latitude, longitude } = currentLocation.coords;
      const radius = 1000; // 1km

      if (!forceRefresh) {
        if (
          restaurantStore.isFresh() &&
          !restaurantStore.hasLocationChanged(latitude, longitude)
        ) {
          console.log('[RESTAURANT_CONTEXT] Using store data (fresh and same location)');
          restaurantStore.setLoading(false);
          return;
        }

        // Essayer de récupérer depuis AsyncStorage
        const cachedData = await getCachedRestaurants();

        if (
          cachedData && 
          cachedData.restaurants.length > 0 &&
          cachedData.latitude === latitude &&
          cachedData.longitude === longitude &&
          cachedData.radius === radius
        ) {
          console.log('[RESTAURANT_CONTEXT] Using cached data from AsyncStorage');
          restaurantStore.setRestaurants(cachedData.restaurants, { latitude, longitude });
          return;
        }
      }

      // Appeler l'API Overpass
      console.log('[RESTAURANT_CONTEXT] Fetching from Overpass API');
      const data = await getRestaurants(latitude, longitude, radius);

      if (!data || data.length === 0) {
        console.warn('[RESTAURANT_CONTEXT] No restaurants found');
        restaurantStore.setRestaurants([], { latitude, longitude });
        return;
      }

      // Mettre à jour le store
      restaurantStore.setRestaurants(data, { latitude, longitude });

      // Sauvegarder dans AsyncStorage
      await cacheRestaurants(data, latitude, longitude, radius);
      
      // Sauvegarder la localisation
      await saveLastLocation(latitude, longitude);

      console.log('[RESTAURANT_CONTEXT] Restaurants loaded:', data.length);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      console.error('[RESTAURANT_CONTEXT] Error fetching restaurants:', error);
      
      // Essayer de récupérer depuis le cache en cas d'erreur
      const cachedData = await getCachedRestaurants();
      if (cachedData && cachedData.restaurants.length > 0) {
        console.log('[RESTAURANT_CONTEXT] Using cached data after error');
        restaurantStore.setRestaurants(cachedData.restaurants, { 
          latitude: cachedData.latitude, 
          longitude: cachedData.longitude 
        });
      } else {
        restaurantStore.setError(errorMessage);
        Alert.alert('Erreur', errorMessage);
      }
    }
  };

  const refreshRestaurants = async () => {
    await fetchRestaurants(true);
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants: state.restaurants,
        loading: state.loading,
        error: state.error,
        location,
        refreshRestaurants,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurantContext = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurantContext must be used within a RestaurantProvider');
  }
  return context;
};
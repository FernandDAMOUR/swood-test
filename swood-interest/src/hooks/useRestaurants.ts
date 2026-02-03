import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Restaurant } from '../types/restaurant';
import { getRestaurants } from '../services/restaurantService';


interface UseRestaurantsResult {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  refetch: (latitude: number, longitude: number, radius?: number) => Promise<void>;
}

export const useRestaurants = (
  latitude?: number,
  longitude?: number,
  radius: number = 1000
): UseRestaurantsResult => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async (lat: number, lng: number, rad: number = 1000) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getRestaurants(lat, lng, rad);
      setRestaurants(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des restaurants';
      setError(errorMessage);
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      fetchRestaurants(latitude, longitude, radius);
    }
  }, [latitude, longitude, radius]);

  const refetch = async (lat: number, lng: number, rad: number = 1000) => {
    await fetchRestaurants(lat, lng, rad);
  };

  return {
    restaurants,
    loading,
    error,
    refetch,
  };
};

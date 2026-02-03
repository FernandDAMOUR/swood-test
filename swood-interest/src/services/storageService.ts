import AsyncStorage from '@react-native-async-storage/async-storage';
import { Restaurant } from '../types/restaurant';

const RESTAURANTS_CACHE_KEY = 'restaurants_cache';
const FAVORITES_KEY = 'favorite_restaurants';
const LAST_LOCATION_KEY = 'last_location';
const CACHE_EXPIRY_KEY = 'cache_expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; 

interface CachedData {
  restaurants: Restaurant[];
  timestamp: number;
  latitude: number;
  longitude: number;
  radius: number;
}


export const cacheRestaurants = async (
  restaurants: Restaurant[],
  latitude: number,
  longitude: number,
  radius: number
): Promise<void> => {
  try {
    const data: CachedData = {
      restaurants,
      timestamp: Date.now(),
      latitude,
      longitude,
      radius,
    };
    await AsyncStorage.setItem(RESTAURANTS_CACHE_KEY, JSON.stringify(data));
    console.log('[STORAGE_SERVICE] Restaurants cachés avec succès');
  } catch (error) {
    console.error('[STORAGE_SERVICE] Erreur lors du cache:', error);
  }
};


export const getCachedRestaurants = async (): Promise<CachedData | null> => {
  try {
    const data = await AsyncStorage.getItem(RESTAURANTS_CACHE_KEY);
    if (!data) return null;

    const cached: CachedData = JSON.parse(data);
    const now = Date.now();

    if (now - cached.timestamp > CACHE_DURATION) {
      console.info('[STORAGE_SERVICE] Cache expiré');
      await AsyncStorage.removeItem(RESTAURANTS_CACHE_KEY);
      return null;
    }

    console.info('[STORAGE_SERVICE] Cache valide, données restituées');
    return cached;
  } catch (error) {
    console.error('[STORAGE_SERVICE] Erreur lors de la lecture du cache:', error);
    return null;
  }
};


export const addToFavorites = async (restaurant: Restaurant): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const exists = favorites.some(fav => fav.id === restaurant.id);
    
    if (!exists) {
      favorites.push(restaurant);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      console.info(`[STORAGE_SERVICE] ${restaurant.name} ajouté aux favoris`);
    }
  } catch (error) {
    console.error('[STORAGE_SERVICE] Erreur lors de l\'ajout aux favoris:', error);
  }
};


export const removeFromFavorites = async (restaurantId: number): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const filtered = favorites.filter(fav => fav.id !== restaurantId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    console.info('[STORAGE_SERVICE] Restaurant retiré des favoris');
  } catch (error) {
    console.error('[STORAGE_SERVICE] Erreur lors du retrait des favoris:', error);
  }
};


export const getFavorites = async (): Promise<Restaurant[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[STORAGE_SERVICE] Erreur lors de la lecture des favoris:', error);
    return [];
  }
};


export const isFavorite = async (restaurantId: number): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some(fav => fav.id === restaurantId);
  } catch (error) {
    console.error('[STORAGE_SERVICE] Erreur lors de la vérification des favoris:', error);
    return false;
  }
};


export const saveLastLocation = async (latitude: number, longitude: number): Promise<void> => {
  try {
    const location = { latitude, longitude, timestamp: Date.now() };
    await AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));
    console.log('[STORAGE_SERVICE] Localisation sauvegardée');
  } catch (error) {
    console.error('[STORAGE_SERVICE] Erreur lors de la sauvegarde de la localisation:', error);
  }
};


export const getLastLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const data = await AsyncStorage.getItem(LAST_LOCATION_KEY);
    if (!data) return null;
    
    const location = JSON.parse(data);
    return { latitude: location.latitude, longitude: location.longitude };
  } catch (error) {
    console.error('[STORAGE_SERVICE] Erreur lors de la lecture de la localisation:', error);
    return null;
  }
};

export const clearAllCache = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      RESTAURANTS_CACHE_KEY,
      FAVORITES_KEY,
      LAST_LOCATION_KEY,
    ]);
    console.log('[STORAGE_SERVICE] Tous les caches sont vidés');
  } catch (error) {
    console.error('[STORAGE_SERVICE] Erreur lors du vidage du cache:', error);
  }
};
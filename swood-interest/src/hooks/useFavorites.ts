import { useState, useEffect, useCallback } from 'react';
import { Restaurant } from '../types/restaurant';
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  isFavorite,
} from '../services/storageService';

interface UseFavoritesResult {
  favorites: Restaurant[];
  loading: boolean;
  isFav: (restaurantId: number) => boolean;
  toggleFavorite: (restaurant: Restaurant) => Promise<void>;
  addFavorite: (restaurant: Restaurant) => Promise<void>;
  removeFavorite: (restaurantId: number) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

export const useFavorites = (): UseFavoritesResult => {
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [favoritesSet, setFavoritesSet] = useState<Set<number>>(new Set());

  const refreshFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const fav = await getFavorites();
      setFavorites(fav);
      setFavoritesSet(new Set(fav.map(f => f.id)));
      console.info('[USE_FAVORITES] Favoris chargés:', fav.length);
    } catch (error) {
      console.error('[USE_FAVORITES] Erreur lors du chargement des favoris:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const isFav = useCallback((restaurantId: number) => {
    return favoritesSet.has(restaurantId);
  }, [favoritesSet]);

  const addFavorite = useCallback(async (restaurant: Restaurant) => {
    try {
      await addToFavorites(restaurant);
      setFavoritesSet(prev => new Set([...prev, restaurant.id]));
      setFavorites(prev => [...prev, restaurant]);
      console.info('[USE_FAVORITES] Restaurant ajouté aux favoris');
    } catch (error) {
      console.error('[USE_FAVORITES] Erreur lors de l\'ajout aux favoris:', error);
    }
  }, []);

  const removeFavorite = useCallback(async (restaurantId: number) => {
    try {
      await removeFromFavorites(restaurantId);
      setFavoritesSet(prev => {
        const newSet = new Set(prev);
        newSet.delete(restaurantId);
        return newSet;
      });
      setFavorites(prev => prev.filter(f => f.id !== restaurantId));
      console.info('[USE_FAVORITES] Restaurant retiré des favoris');
    } catch (error) {
      console.error('[USE_FAVORITES] Erreur lors du retrait des favoris:', error);
    }
  }, []);

  const toggleFavorite = useCallback(async (restaurant: Restaurant) => {
    if (isFav(restaurant.id)) {
      await removeFavorite(restaurant.id);
    } else {
      await addFavorite(restaurant);
    }
  }, [isFav, addFavorite, removeFavorite]);

  return {
    favorites,
    loading,
    isFav,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    refreshFavorites,
  };
};
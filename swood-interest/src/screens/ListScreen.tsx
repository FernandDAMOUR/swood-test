import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRestaurants } from '../hooks/useRestaurants';
import { useFavorites } from '../hooks/useFavorites';

export const ListScreen = () => {
  const { restaurants, loading, error } = useRestaurants();
  const { isFav, toggleFavorite, favorites } = useFavorites();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const displayedRestaurants = showFavoritesOnly ? favorites : restaurants;

  const renderRestaurantItem = ({ item }: { item: any }) => (
    <View style={styles.restaurantCard}>
      <View style={styles.restaurantHeader}>
        <Text style={styles.restaurantName}>🍽️ {item.name}</Text>
        <TouchableOpacity 
          style={styles.favoriteIcon}
          onPress={() => toggleFavorite(item)}
        >
          <Text style={styles.favoriteIconText}>
            {isFav(item.id) ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      
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

      {/* Bouton pour filtrer les favoris */}
      <TouchableOpacity 
        style={[
          styles.filterButton,
          showFavoritesOnly && styles.filterButtonActive
        ]}
        onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
      >
        <Text style={styles.filterButtonText}>
          {showFavoritesOnly 
            ? `❤️ Mes favoris (${favorites.length})` 
            : `🤍 Tous les restaurants (${restaurants.length})`}
        </Text>
      </TouchableOpacity>

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

      {!loading && displayedRestaurants.length === 0 && !error && (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>
            {showFavoritesOnly 
              ? 'Aucun restaurant favori'
              : 'Aucun restaurant trouvé'}
          </Text>
        </View>
      )}

      {!loading && displayedRestaurants.length > 0 && (
        <FlatList
          data={displayedRestaurants}
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
  filterButton: {
    margin: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  filterButtonActive: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFE8E8',
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  favoriteIcon: {
    padding: 8,
    marginLeft: 10,
  },
  favoriteIconText: {
    fontSize: 20,
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
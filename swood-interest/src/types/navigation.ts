/**
 * Types pour la navigation de l'application
 * Définit les paramètres de chaque écran dans le Stack Navigator
 */

export type RootStackParamList = {
  Map: undefined;
  List: undefined;
  RestaurantDetail: { restaurantId: string };
};

/**
 * Type pour les props de navigation
 * Utilisé dans les composants d'écran
 */
export type ScreenNavigationProp = any; 

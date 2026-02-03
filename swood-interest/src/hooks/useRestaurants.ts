import { useRestaurantContext } from '../store/RestaurantContext';

export const useRestaurants = () => {
  return useRestaurantContext();
};

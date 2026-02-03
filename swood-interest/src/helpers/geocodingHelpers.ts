import * as Location from 'expo-location';

/**
 * Convertit des coordonnées GPS en adresse complète via reverse geocoding
 */
export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const geocodedAddress = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (geocodedAddress && geocodedAddress.length > 0) {
      const address = geocodedAddress[0];
      const parts = [
        address.streetNumber,
        address.street,
        address.postalCode,
        address.city,
        address.region,
        address.country,
      ].filter(Boolean);

      return parts.join(', ');
    }
    
    return null;
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    return null;
  }
};

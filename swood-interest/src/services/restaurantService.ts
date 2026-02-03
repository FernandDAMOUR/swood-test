import { Restaurant, OverpassResponse } from '../types/restaurant';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; 


const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getRestaurants = async (
  latitude: number,
  longitude: number,
  radius: number = 1000
): Promise<Restaurant[]> => {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="restaurant"](around:${radius},${latitude},${longitude});
      way["amenity"="restaurant"](around:${radius},${latitude},${longitude});
    );
    out body;
  `;

  let lastError: Error | null = null;

  // Tentative avec retry en cas d'erreur 503
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(
        `https://overpass.kumi.systems/api/interpreter?data=${encodeURIComponent(query)}`,
      );

      // Gestion spécifique de l'erreur 503 (Service Unavailable)
      if (response.status === 503) {
        console.warn(`Tentative ${attempt}/${MAX_RETRIES}: Erreur 503, nouvelle tentative dans ${RETRY_DELAY}ms...`);
        lastError = new Error(`Service temporairement indisponible (503)`);
        
        if (attempt < MAX_RETRIES) {
          await wait(RETRY_DELAY);
          continue;
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status} ${response.statusText}: ${errorText.substring(0, 200)}`,
        );
      }

      const data: OverpassResponse = await response.json();

      if (!data.elements) {
        throw new Error("Format de réponse invalide: éléments manquants");
      }

      return data.elements
        .filter((el) => el.tags?.name)
        .map((element) => ({
          id: element.id,
          name: element.tags!.name!,
          latitude: element.lat || element.center?.lat || 0,
          longitude: element.lon || element.center?.lon || 0,
          cuisine: element.tags!.cuisine,
          phone: element.tags!.phone,
          website: element.tags!.website,
          address: element.tags?.["addr:street"],
          city: element.tags?.["addr:city"],
        }));

    } catch (error) {
      lastError = error as Error;
      
      if (attempt < MAX_RETRIES) {
        console.warn(`Tentative ${attempt}/${MAX_RETRIES} échouée:`, error);
        await wait(RETRY_DELAY);
      }
    }
  }

  // Si toutes les tentatives ont échoué
  throw lastError || new Error('Échec de récupération des restaurants');
};

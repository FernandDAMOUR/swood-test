import { Restaurant } from '../types/restaurant';

interface RestaurantState {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

class RestaurantStore {
  private state: RestaurantState = {
    restaurants: [],
    loading: false,
    error: null,
    lastFetch: null,
    location: null,
  };

  private listeners: Set<(state: RestaurantState) => void> = new Set();


  subscribe(listener: (state: RestaurantState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }


  getState(): RestaurantState {
    return { ...this.state };
  }


  setState(partialState: Partial<RestaurantState>): void {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }


  setRestaurants(restaurants: Restaurant[], location: { latitude: number; longitude: number }): void {
    this.setState({
      restaurants,
      loading: false,
      error: null,
      lastFetch: Date.now(),
      location,
    });
  }


  setLoading(loading: boolean): void {
    this.setState({ loading });
  }

  
  setError(error: string): void {
    this.setState({ error, loading: false });
  }

  
  reset(): void {
    this.state = {
      restaurants: [],
      loading: false,
      error: null,
      lastFetch: null,
      location: null,
    };
    this.notify();
  }


  isFresh(): boolean {
    if (!this.state.lastFetch) return false;
    const age = Date.now() - this.state.lastFetch;
    return age < 30 * 60 * 1000; // 30 minutes
  }


  hasLocationChanged(newLat: number, newLon: number): boolean {
    if (!this.state.location) return true;
    
    const latDiff = Math.abs(this.state.location.latitude - newLat);
    const lonDiff = Math.abs(this.state.location.longitude - newLon);
    
    // ~0.001 degré = ~100m
    return latDiff > 0.001 || lonDiff > 0.001;
  }
}

export const restaurantStore = new RestaurantStore();
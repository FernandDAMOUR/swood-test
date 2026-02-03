export interface Restaurant {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  cuisine?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
}


export interface OverpassElement {
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    name?: string;
    cuisine?: string;
    phone?: string;
    website?: string;
    'addr:street'?: string;
    'addr:city'?: string;
  };
}

export interface OverpassResponse {
  elements: OverpassElement[];
}

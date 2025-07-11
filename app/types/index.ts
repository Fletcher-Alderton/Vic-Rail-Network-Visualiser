// Proper GeoJSON FeatureCollection interface for train lines
export interface TrainLineData {
  type: 'FeatureCollection';
  properties?: {
    exceededTransferLimit?: boolean;
  };
  features: Array<{
    type: 'Feature';
    id: number;
    geometry: {
      type: 'LineString' | 'MultiLineString';
      coordinates: number[][] | number[][][];
    };
    properties: {
      feature_type_code: string;
      name: string | null;
      physical_condition: string;
      rail_gauge: string | null;
      tourist_type: string;
      Shape__Length: number;
      [key: string]: any;
    };
  }>;
}

// Interface for stops/stations (point geometry)
export interface StopsData {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    id: number;
    geometry: {
      type: 'Point';
      coordinates: [number, number];
    };
    properties: {
      feature_type_code: string;
      name: string | null;
      physical_condition?: string;
      [key: string]: any;
    };
  }>;
}

// Filter state interface
export interface FilterState {
  [key: string]: boolean;
}

// Feature type info interface
export interface FeatureTypeInfo {
  label: string;
  color: string;
  icon: string;
}

// Type mappings
export const railwayTypes: Record<string, FeatureTypeInfo> = {
  'railway': { label: 'Railway Lines', color: '#2563eb', icon: '🚊' },
  'rail_disused': { label: 'Disused Railways', color: '#6b7280', icon: '🚂' },
  'bridge_rail_o': { label: 'Railway Bridges', color: '#f59e0b', icon: '🌉' },
  'tunnel_rail_o': { label: 'Railway Tunnels', color: '#374151', icon: '🚇' },
  'rail_uground_o': { label: 'Underground Railways', color: '#7c3aed', icon: '🚇' },
  'bridge_rail_du': { label: 'Railway Bridges (Under)', color: '#f59e0b', icon: '🌉' },
};

export const infrastructureTypes: Record<string, FeatureTypeInfo> = {
  'rail_station': { label: 'Rail Stations', color: '#059669', icon: '🚂' },
  'tram_station': { label: 'Tram Stations', color: '#7c3aed', icon: '🚋' },
  'bridge_rail_dm': { label: 'Rail Bridges (Double Main)', color: '#f59e0b', icon: '🌉' },
  'bridge_rail_du': { label: 'Rail Bridges (Double Under)', color: '#f59e0b', icon: '🌉' },
  'bridge_rail_o': { label: 'Rail Bridges (Over)', color: '#f59e0b', icon: '🌉' },
  'tunnel_rail_o': { label: 'Rail Tunnels (Over)', color: '#6b7280', icon: '🚇' },
}; 
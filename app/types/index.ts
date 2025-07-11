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
  'railway': { label: 'Railway Lines', color: '#2563eb', icon: '🛤️' },
  'rail_dismantled': { label: 'Rail Dismantled', color: '#94a3b8', icon: '🚆' },
  'rail_tourist': { label: 'Rail Tourist', color: '#f97316', icon: '🛤️' },
  'marshalling_yard_rail': { label: 'Marshalling Yard Rail', color: '#8b5cf6', icon: '🚃' },
  'rail_disused': { label: 'Disused Railways', color: '#6b7280', icon: '🛤️' },
  'tramway': { label: 'Tramway', color: '#06b6d4', icon: '🚇' },
  'tunnel_rail_o': { label: 'Railway Tunnels', color: '#374151', icon: '🛤️' },
  'rail_siding': { label: 'Rail Siding', color: '#65a30d', icon: '🛤️' },
  'bridge_rail_dm': { label: 'Bridge Rail Dm', color: '#dc2626', icon: '🏗️' },
  'bridge_rail_du': { label: 'Railway Bridges (Under)', color: '#f59e0b', icon: '🌉' },
  'bridge_rail_o': { label: 'Railway Bridges', color: '#f59e0b', icon: '🌉' },
  'rail_uground_o': { label: 'Underground Railways', color: '#7c3aed', icon: '⚡' },
  'tunnel_rail_dm': { label: 'Tunnel Rail Dm', color: '#475569', icon: '🛤️' },
  'tram_dismantled': { label: 'Tram Dismantled', color: '#9ca3af', icon: '🛤️' },
};

export const infrastructureTypes: Record<string, FeatureTypeInfo> = {
  'tram_station': { label: 'Tram Station', color: '#7c3aed', icon: '🚪' },
  'rail_station': { label: 'Rail Stations', color: '#059669', icon: '🚉' },
  'bridge_rail_o': { label: 'Rail Bridges (Over)', color: '#f59e0b', icon: '🌉' },
  'bridge_rail_du': { label: 'Rail Bridges (Double Under)', color: '#dc2626', icon: '🏗️' },
  'bridge_rail_dm': { label: 'Rail Bridges (Double Main)', color: '#8b5cf6', icon: '🌁' },
  'tunnel_rail_o': { label: 'Rail Tunnels (Over)', color: '#6b7280', icon: '🕳️' },
}; 
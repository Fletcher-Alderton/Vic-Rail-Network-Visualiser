'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useTheme } from 'next-themes';
import { useTrainData } from '../hooks/useTrainData';
import { useFilters } from '../hooks/useFilters';
import { railwayTypes, infrastructureTypes } from '../types';
import Sidebar from './Sidebar';
import Loading from './Loading';

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

const TrainLinesMap = React.memo(() => {
  const { theme } = useTheme();
  
  // Use custom hooks for data and filters
  const { trainData, stopsData, loading, error } = useTrainData();
  const {
    railwayFilters,
    infrastructureFilters,
    toggleRailwayFilter,
    toggleInfrastructureFilter,
    toggleAllRailway,
    toggleAllInfrastructure
  } = useFilters(trainData, stopsData);

  // Get filtered data for rendering - use useMemo to make it reactive to filter changes
  const filteredTrainData = useMemo(() => {
    if (!trainData) return null;
    
    const filteredFeatures = trainData.features.filter(feature => 
      railwayFilters[feature.properties.feature_type_code] === true
    );
    
    return {
      ...trainData,
      features: filteredFeatures
    };
  }, [trainData, railwayFilters]);

  const filteredStopsData = useMemo(() => {
    if (!stopsData) return null;
    
    const filteredFeatures = stopsData.features.filter(feature => 
      infrastructureFilters[feature.properties.feature_type_code] === true
    );
    
    return {
      ...stopsData,
      features: filteredFeatures
    };
  }, [stopsData, infrastructureFilters]);

  // Styling using colors from type mappings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLineStyle = (feature: any) => {
    const featureType = feature.properties.feature_type_code;
    const typeInfo = railwayTypes[featureType];
    
    // Use the color from type mappings, fallback to red for unknown types
    const color = typeInfo ? typeInfo.color : '#dc2626';
    
    return {
      color: color,
      weight: 2,
      opacity: 0.8,
    };
  };

  // Popup with type information from mappings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties;
    const featureType = props.feature_type_code;
    const typeInfo = railwayTypes[featureType];
    
    const displayName = props.name && props.name.trim() !== "" && props.name !== "Active Train Line" 
      ? props.name 
      : 'Unnamed Railway';
    
    const typeLabel = typeInfo ? typeInfo.label : featureType.replace('_', ' ');
    const typeIcon = typeInfo ? typeInfo.icon : '🛤️';
    
    // Theme-aware colors for accessibility
    const titleColor = 'hsl(var(--popover-foreground))';
    const textColor = 'hsl(var(--muted-foreground))';
    
    const popupContent = `
      <div style="font-family: system-ui; max-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: ${titleColor};">
          ${displayName}
        </h3>
        <div style="font-size: 12px; color: ${textColor};">
          ${typeIcon} ${typeLabel}
          ${props.rail_gauge ? ` • ${props.rail_gauge}` : ''}
        </div>
        ${props.physical_condition ? '<div style="font-size: 11px; color: ' + textColor + '; margin-top: 4px;">Condition: ' + props.physical_condition + '</div>' : ''}
      </div>
    `;
    layer.bindPopup(popupContent);
  };

  // Get marker style for stops based on type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getStopMarkerStyle = (feature: any) => {
    const featureType = feature.properties.feature_type_code;
    const typeInfo = infrastructureTypes[featureType];
    
    // Use the color from type mappings, fallback to red for unknown types
    const fillColor = typeInfo ? typeInfo.color : '#ef4444';
    const borderColor = theme === 'dark' ? '#374151' : '#ffffff';
    
    return {
      fillColor: fillColor,
      color: borderColor,
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    };
  };

  // Get marker radius for stops based on type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getStopMarkerRadius = (feature: any) => {
    const featureType = feature.properties.feature_type_code;
    const minRadius = 6; // Minimum point size for visibility and interaction
    
    // Size mapping for different feature types
    const sizeMap: { [key: string]: number } = {
      'rail_station': 6,
      'tram_station': 6,
      'bridge_rail_dm': 6,
      'bridge_rail_du': 6,
      'bridge_rail_o': 6,
      'tunnel_rail_o': 6,
    };
    
    const radius = sizeMap[featureType] || 6; // Default size for unknown types
    return Math.max(radius, minRadius); // Ensure minimum size
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!trainData || trainData.features.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">No train data found</div>
      </div>
    );
  }

  // Center on Victoria, Australia
  const center: [number, number] = [-37.8136, 144.9631];
  const zoom = 7;

  return (
    <div className="w-full h-screen relative">
      
      {/* Sidebar Component */}
      <Sidebar
        railwayFilters={railwayFilters}
        infrastructureFilters={infrastructureFilters}
        toggleRailwayFilter={toggleRailwayFilter}
        toggleInfrastructureFilter={toggleInfrastructureFilter}
        toggleAllRailway={toggleAllRailway}
        toggleAllInfrastructure={toggleAllInfrastructure}
        railwayCount={filteredTrainData?.features.length || 0}
        infrastructureCount={filteredStopsData?.features.length || 0}
      />
      
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100vh', width: '100%' }}
        className="bg-gray-50 dark:bg-gray-900"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={
            theme === 'dark'
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          }
        />
        
        <ZoomControl position="bottomright" />
        
        {/* Render railway lines */}
        {filteredTrainData && filteredTrainData.features.length > 0 && (
          <GeoJSON
            key={`railway-${filteredTrainData.features.length}-${Object.values(railwayFilters).filter(Boolean).length}`}
            data={filteredTrainData}
            style={getLineStyle}
            onEachFeature={onEachFeature}
          />
        )}
        
        {/* Render stops/stations */}
        {filteredStopsData && filteredStopsData.features.map((feature, index) => {
           const coords = feature.geometry.coordinates;
           const props = feature.properties;
           const displayName = props.name || 'Unnamed Infrastructure';
           
           // Get appropriate type display and icon from type mappings
           const getTypeInfo = (featureType: string) => {
             const typeInfo = infrastructureTypes[featureType];
             return typeInfo ? 
               { display: typeInfo.label, icon: typeInfo.icon } : 
               { display: featureType.replace('_', ' '), icon: '📍' };
           };
           
           const typeInfo = getTypeInfo(props.feature_type_code);
           const stationType = typeInfo.display;
           const stationIcon = typeInfo.icon;
           
           return (
             <CircleMarker
               key={`stop-${feature.id || index}-${feature.properties.feature_type_code}-${infrastructureFilters[feature.properties.feature_type_code] ? 'visible' : 'hidden'}`}
               center={[coords[1], coords[0]]} // Note: GeoJSON uses [lng, lat], Leaflet uses [lat, lng]
               radius={getStopMarkerRadius(feature)}
               pathOptions={getStopMarkerStyle(feature)}
             >
               <Popup>
                 <div style={{ fontFamily: 'system-ui', maxWidth: '200px' }}>
                   <h3 style={{ 
                     margin: '0 0 8px 0', 
                     fontSize: '14px', 
                     fontWeight: '600',
                     color: 'hsl(var(--popover-foreground))' 
                   }}>
                     {displayName}
                   </h3>
                   <div style={{ 
                     fontSize: '12px', 
                     color: 'hsl(var(--muted-foreground))' 
                   }}>
                     {stationIcon} {stationType}
                   </div>
                   {props.physical_condition && (
                     <div style={{ 
                       fontSize: '11px', 
                       color: 'hsl(var(--muted-foreground))', 
                       marginTop: '4px' 
                     }}>
                       Condition: {props.physical_condition}
                     </div>
                   )}
                 </div>
               </Popup>
             </CircleMarker>
           );
         })}
      </MapContainer>
    </div>
  );
});

TrainLinesMap.displayName = 'TrainLinesMap';

export default TrainLinesMap;
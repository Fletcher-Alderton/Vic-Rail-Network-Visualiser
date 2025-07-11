'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useTrainData } from '../hooks/useTrainData';
import { useFilters } from '../hooks/useFilters';
import FilterPanel from './FilterPanel';
import InfoOverlay from './InfoOverlay';

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

const TrainLinesMap = () => {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Use custom hooks for data and filters
  const { trainData, stopsData, loading, error } = useTrainData();
  const {
    railwayFilters,
    infrastructureFilters,
    toggleRailwayFilter,
    toggleInfrastructureFilter,
    toggleAllRailway,
    toggleAllInfrastructure,
    getFilteredTrainData,
    getFilteredStopsData
  } = useFilters(trainData, stopsData);

  // Styling with different colors for proper vs problematic features
  const getLineStyle = (feature: any) => {
    const hasProperName = feature.properties.name && 
                         feature.properties.name.trim() !== "" && 
                         feature.properties.name !== "Active Train Line";
    
    return {
      color: hasProperName ? '#2563eb' : '#dc2626', // Blue for proper names, red for problematic
      weight: 2,
      opacity: 0.8,
    };
  };

  // Popup with identification of problematic data
  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties;
    const hasProperName = props.name && 
                         props.name.trim() !== "" && 
                         props.name !== "Active Train Line";
    
    const displayName = hasProperName ? props.name : 'Unnamed Railway (Data Error)';
    const statusIcon = hasProperName ? '🚊' : '⚠️';
    const statusColor = hasProperName ? '#1f2937' : '#dc2626';
    
    const popupContent = `
      <div style="font-family: system-ui; max-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: ${statusColor};">
          ${displayName}
        </h3>
        <div style="font-size: 12px; color: #6b7280;">
          ${statusIcon} ${hasProperName ? 'Named Railway' : 'Data Error - Missing Name'}
          ${props.rail_gauge ? ` • ${props.rail_gauge}` : ''}
        </div>
        ${!hasProperName ? '<div style="font-size: 11px; color: #dc2626; margin-top: 4px;">Type: ' + props.feature_type_code + '</div>' : ''}
      </div>
    `;
    layer.bindPopup(popupContent);
  };

  // Get marker style for stops based on type
  const getStopMarkerStyle = (feature: any) => {
    const featureType = feature.properties.feature_type_code;
    
    // Color mapping for different feature types
    const colorMap: { [key: string]: string } = {
      'rail_station': '#059669',     // Green for rail stations
      'tram_station': '#7c3aed',     // Purple for tram stations
      'bridge_rail_dm': '#f59e0b',   // Amber for bridge rail double main
      'bridge_rail_du': '#f59e0b',   // Amber for bridge rail double under
      'bridge_rail_o': '#f59e0b',    // Amber for bridge rail over
      'tunnel_rail_o': '#6b7280',    // Gray for tunnel rail over
    };
    
    return {
      fillColor: colorMap[featureType] || '#ef4444', // Red for unknown types
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    };
  };

  // Get marker radius for stops based on type
  const getStopMarkerRadius = (feature: any) => {
    const featureType = feature.properties.feature_type_code;
    
    // Size mapping for different feature types
    const sizeMap: { [key: string]: number } = {
      'rail_station': 6,
      'tram_station': 5,
      'bridge_rail_dm': 4,
      'bridge_rail_du': 4,
      'bridge_rail_o': 4,
      'tunnel_rail_o': 4,
    };
    
    return sizeMap[featureType] || 3; // Default size for unknown types
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading train lines and stops...</div>
      </div>
    );
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

  // Get filtered data for rendering
  const filteredTrainData = getFilteredTrainData();
  const filteredStopsData = getFilteredStopsData();

  // Center on Victoria, Australia
  const center: [number, number] = [-37.8136, 144.9631];
  const zoom = 7;

  return (
    <div className="w-full h-screen relative">
      {/* Filter Panel Component */}
      <FilterPanel
        showFilterPanel={showFilterPanel}
        setShowFilterPanel={setShowFilterPanel}
        railwayFilters={railwayFilters}
        infrastructureFilters={infrastructureFilters}
        toggleRailwayFilter={toggleRailwayFilter}
        toggleInfrastructureFilter={toggleInfrastructureFilter}
        toggleAllRailway={toggleAllRailway}
        toggleAllInfrastructure={toggleAllInfrastructure}
        railwayCount={filteredTrainData?.features.length || 0}
        totalRailwayCount={trainData?.features.length || 0}
        infrastructureCount={filteredStopsData?.features.length || 0}
        totalInfrastructureCount={stopsData?.features.length || 0}
      />

      {/* Info Overlay Component */}
      <InfoOverlay
        railwayCount={filteredTrainData?.features.length || 0}
        infrastructureCount={filteredStopsData?.features.length || 0}
      />
      
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100vh', width: '100%' }}
        className="bg-gray-50"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <ZoomControl position="bottomright" />
        
                {/* Render railway lines */}
        {filteredTrainData && filteredTrainData.features.length > 0 && (
          <GeoJSON
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
           
           // Get appropriate type display and icon
           const getTypeInfo = (featureType: string) => {
             const typeMap: { [key: string]: { display: string; icon: string } } = {
               'rail_station': { display: 'Rail Station', icon: '🚂' },
               'tram_station': { display: 'Tram Station', icon: '🚋' },
               'bridge_rail_dm': { display: 'Rail Bridge (Double Main)', icon: '🌉' },
               'bridge_rail_du': { display: 'Rail Bridge (Double Under)', icon: '🌉' },
               'bridge_rail_o': { display: 'Rail Bridge (Over)', icon: '🌉' },
               'tunnel_rail_o': { display: 'Rail Tunnel (Over)', icon: '🚇' },
             };
             return typeMap[featureType] || { display: featureType.replace('_', ' '), icon: '📍' };
           };
           
           const typeInfo = getTypeInfo(props.feature_type_code);
           const stationType = typeInfo.display;
           const stationIcon = typeInfo.icon;
           
           return (
             <CircleMarker
               key={`stop-${feature.id}-${index}`}
               center={[coords[1], coords[0]]} // Note: GeoJSON uses [lng, lat], Leaflet uses [lat, lng]
               radius={getStopMarkerRadius(feature)}
               pathOptions={getStopMarkerStyle(feature)}
             >
               <Popup>
                 <div style={{ fontFamily: 'system-ui', maxWidth: '200px' }}>
                   <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1f2937' }}>
                     {displayName}
                   </h3>
                   <div style={{ fontSize: '12px', color: '#6b7280' }}>
                     {stationIcon} {stationType}
                   </div>
                   {props.physical_condition && (
                     <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
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
};

export default TrainLinesMap;
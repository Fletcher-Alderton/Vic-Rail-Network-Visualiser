import { useState, useEffect } from 'react';
import { FilterState, TrainLineData, StopsData } from '../types';

export const useFilters = (trainData: TrainLineData | null, stopsData: StopsData | null) => {
  const [railwayFilters, setRailwayFilters] = useState<FilterState>({});
  const [infrastructureFilters, setInfrastructureFilters] = useState<FilterState>({});

  // Initialize filters when data is loaded
  useEffect(() => {
    if (trainData && stopsData) {
      initializeFilters(trainData, stopsData);
    }
  }, [trainData, stopsData]);

  // Initialize filters with all types enabled by default
  const initializeFilters = (trainData: TrainLineData, stopsData: StopsData) => {
    // Get unique feature types from actual data
    const trainTypes = [...new Set(trainData.features.map(f => f.properties.feature_type_code))];
    const stopTypes = [...new Set(stopsData.features.map(f => f.properties.feature_type_code))];
    

    
    // Initialize all filters as enabled
    const initialRailwayFilters: FilterState = {};
    trainTypes.forEach(type => {
      initialRailwayFilters[type] = true;
    });
    
    const initialInfrastructureFilters: FilterState = {};
    stopTypes.forEach(type => {
      initialInfrastructureFilters[type] = true;
    });
    
    setRailwayFilters(initialRailwayFilters);
    setInfrastructureFilters(initialInfrastructureFilters);
  };

  // Filter functions
  const toggleRailwayFilter = (type: string) => {
    setRailwayFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const toggleInfrastructureFilter = (type: string) => {
    setInfrastructureFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const toggleAllRailway = (enabled: boolean) => {
    const newFilters: FilterState = {};
    Object.keys(railwayFilters).forEach(type => {
      newFilters[type] = enabled;
    });
    setRailwayFilters(newFilters);
  };

  const toggleAllInfrastructure = (enabled: boolean) => {
    const newFilters: FilterState = {};
    Object.keys(infrastructureFilters).forEach(type => {
      newFilters[type] = enabled;
    });
    setInfrastructureFilters(newFilters);
  };

  // Get filtered data
  const getFilteredTrainData = (): TrainLineData | null => {
    if (!trainData) return null;
    
    const filteredFeatures = trainData.features.filter(feature => 
      railwayFilters[feature.properties.feature_type_code] === true
    );
    
    return {
      ...trainData,
      features: filteredFeatures
    };
  };

  const getFilteredStopsData = (): StopsData | null => {
    if (!stopsData) return null;
    
    const filteredFeatures = stopsData.features.filter(feature => 
      infrastructureFilters[feature.properties.feature_type_code] === true
    );
    
    return {
      ...stopsData,
      features: filteredFeatures
    };
  };

  return {
    railwayFilters,
    infrastructureFilters,
    toggleRailwayFilter,
    toggleInfrastructureFilter,
    toggleAllRailway,
    toggleAllInfrastructure,
    getFilteredTrainData,
    getFilteredStopsData
  };
}; 
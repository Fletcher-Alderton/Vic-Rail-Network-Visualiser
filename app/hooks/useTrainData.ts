import { useState, useEffect } from 'react';
import { TrainLineData, StopsData } from '../types';

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Helper functions for caching
const getCachedData = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();
    
    if (now - entry.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    
    return entry.data;
  } catch (error) {
    localStorage.removeItem(key);
    return null;
  }
};

const setCachedData = <T>(key: string, data: T): void => {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    // If localStorage is full or unavailable, continue without caching
  }
};

export const useTrainData = () => {
  const [trainData, setTrainData] = useState<TrainLineData | null>(null);
  const [stopsData, setStopsData] = useState<StopsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Check cache first
        const cachedTrainData = getCachedData<TrainLineData>('trainData');
        const cachedStopsData = getCachedData<StopsData>('stopsData');
        
        if (cachedTrainData && cachedStopsData) {
          setTrainData(cachedTrainData);
          setStopsData(cachedStopsData);
          setLoading(false);
          return;
        }
        
        // Fetch data if not cached or expired
        const promises: Promise<any>[] = [];
        
        if (!cachedTrainData) {
          promises.push(fetchTrainData());
        } else {
          promises.push(Promise.resolve(cachedTrainData));
        }
        
        if (!cachedStopsData) {
          promises.push(fetchStopsData());
        } else {
          promises.push(Promise.resolve(cachedStopsData));
        }
        
        const [trainDataResult, stopsDataResult] = await Promise.all(promises);
        
        // Cache the results if they were fetched
        if (!cachedTrainData) {
          setCachedData('trainData', trainDataResult);
        }
        if (!cachedStopsData) {
          setCachedData('stopsData', stopsDataResult);
        }
        
        setTrainData(trainDataResult);
        setStopsData(stopsDataResult);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchTrainData = async (): Promise<TrainLineData> => {
      const apiUrl = 
        "https://services6.arcgis.com/GB33F62SbDxJjwEL/ArcGIS/rest/services/Vicmap_Transport/FeatureServer/3/query";
      
      let allFeatures: any[] = [];
      let offset = 0;
      const batchSize = 2000;
      let hasMoreData = true;

      while (hasMoreData) {
        const params = new URLSearchParams({
          where: "1=1", // Get all features, no filtering
          outFields: "*",
          f: "geojson",
          resultRecordCount: batchSize.toString(),
          resultOffset: offset.toString(),
          returnGeometry: "true"
        });

        const response = await fetch(`${apiUrl}?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          allFeatures.push(...data.features);
          
          if (data.features.length < batchSize) {
            hasMoreData = false;
          } else {
            offset += batchSize;
          }
        } else {
          hasMoreData = false;
        }
      }

      return {
        type: 'FeatureCollection' as const,
        features: allFeatures
      };
    };

    const fetchStopsData = async (): Promise<StopsData> => {
      const apiUrl = 
        "https://services6.arcgis.com/GB33F62SbDxJjwEL/ArcGIS/rest/services/Vicmap_Transport/FeatureServer/2/query";
      
      let allFeatures: any[] = [];
      let offset = 0;
      const batchSize = 2000;
      let hasMoreData = true;

      while (hasMoreData) {
        const params = new URLSearchParams({
          where: "1=1", // Get all features, no filtering
          outFields: "*",
          f: "geojson",
          resultRecordCount: batchSize.toString(),
          resultOffset: offset.toString(),
          returnGeometry: "true"
        });

        const response = await fetch(`${apiUrl}?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          allFeatures.push(...data.features);
          
          if (data.features.length < batchSize) {
            hasMoreData = false;
          } else {
            offset += batchSize;
          }
        } else {
          hasMoreData = false;
        }
      }

      return {
        type: 'FeatureCollection' as const,
        features: allFeatures
      };
    };

    fetchAllData();
  }, []);

  return {
    trainData,
    stopsData,
    loading,
    error
  };
}; 
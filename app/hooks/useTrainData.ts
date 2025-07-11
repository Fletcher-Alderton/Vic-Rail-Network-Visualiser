import { useState, useEffect } from 'react';
import { TrainLineData, StopsData } from '../types';

export const useTrainData = () => {
  const [trainData, setTrainData] = useState<TrainLineData | null>(null);
  const [stopsData, setStopsData] = useState<StopsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch both train lines and stops in parallel
        const [trainDataResult, stopsDataResult] = await Promise.all([
          fetchTrainData(),
          fetchStopsData()
        ]);
        
        setTrainData(trainDataResult);
        setStopsData(stopsDataResult);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
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

      console.log('Starting to fetch all railway data in batches...');

      while (hasMoreData) {
        const params = new URLSearchParams({
          where: "1=1", // Get all features, no filtering
          outFields: "*",
          f: "geojson",
          resultRecordCount: batchSize.toString(),
          resultOffset: offset.toString(),
          returnGeometry: "true"
        });

        console.log(`Fetching railway batch starting at offset ${offset}...`);

        const response = await fetch(`${apiUrl}?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          allFeatures.push(...data.features);
          console.log(`Fetched ${data.features.length} railway features, total so far: ${allFeatures.length}`);
          
          if (data.features.length < batchSize) {
            hasMoreData = false;
          } else {
            offset += batchSize;
          }
        } else {
          hasMoreData = false;
        }
      }

      console.log(`Finished fetching railway data! Total features: ${allFeatures.length}`);
       
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

      console.log('Starting to fetch all stops/stations data in batches...');

      while (hasMoreData) {
        const params = new URLSearchParams({
          where: "1=1", // Get all features, no filtering
          outFields: "*",
          f: "geojson",
          resultRecordCount: batchSize.toString(),
          resultOffset: offset.toString(),
          returnGeometry: "true"
        });

        console.log(`Fetching stops batch starting at offset ${offset}...`);

        const response = await fetch(`${apiUrl}?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          allFeatures.push(...data.features);
          console.log(`Fetched ${data.features.length} stops features, total so far: ${allFeatures.length}`);
          
          if (data.features.length < batchSize) {
            hasMoreData = false;
          } else {
            offset += batchSize;
          }
        } else {
          hasMoreData = false;
        }
      }

      console.log(`Finished fetching stops data! Total features: ${allFeatures.length}`);
      
      // Log breakdown of what we got
      const typeCounts = allFeatures.reduce((acc: any, f: any) => {
        const type = f.properties.feature_type_code;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      console.log('Stops feature type breakdown:', typeCounts);
      
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
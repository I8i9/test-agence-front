import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Install: npm install uuid


const apiKey = 'AIzaSyA6MPJvuZk_FwLObsqTHZpcmZspro_gVh4'; // Replace with your Google Maps API key
let sessionToken = uuidv4();

const fetchGeocode = async (query) => {
  if (!query || query.trim().length < 2) return null;

  const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: query,
      key: apiKey,
      language: 'fr',
      components: 'country:TN',
      sessiontoken: sessionToken,
       
    },
  });
  
  // Filter to only include specific location types and limit to 5 results
  if (response.data.results && response.data.results.length > 0) {
    const filteredResults = response.data.results
      .filter(result => {
        const types = result.types || [];
        
        // Only accept results with specific location types
        const hasSpecificType = types.some(type => 
          ['locality', 'postal_code', 'route', 'street_address', 
           'premise', 'sublocality', 'neighborhood'].includes(type)
        );
        
        return hasSpecificType;
      })
    
    // Return null if no valid results after filtering
    return filteredResults.length > 0 ? { ...response.data, results: filteredResults } : null;
  }
  
  return response.data;
};

export const useMapQuery = (query) => {
  const Queryminus = query?.trim().toLowerCase();
  return useQuery({
    queryKey: ['map', Queryminus],
    queryFn: () => fetchGeocode(Queryminus),
    enabled: !!Queryminus,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, // Note: cacheTime is now gcTime in newer versions of React Query
    retry: false,
  });
};
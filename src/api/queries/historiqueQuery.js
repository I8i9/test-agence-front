import { useQuery } from '@tanstack/react-query' 
import mainapi from '../axios/main.api.js';

export const fetchHistorique = async (payload) => {
    console.log("Fetching historique with payload:", payload);
    const response = await mainapi.get('/logs', { params: payload });
    console.log(response.data.data)
    return response.data.data; 
}
export const useHistorique = (payload , options = {}) => {
    return useQuery({

        queryFn: () => fetchHistorique(payload),    
        queryKey: ['historique' ],
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled : options.enabled ?? true,
    });
  
}

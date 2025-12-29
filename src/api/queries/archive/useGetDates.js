import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getDatesApi=async()=>{
      const response = await mainapi.get('/archive/dates');
      return response.data.data; 
}
export default function useFetchDates() {
    return useQuery({
        queryKey: ['dates'],
        queryFn: getDatesApi,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 1, // 1 millisecond to always fetch fresh data
    });
}
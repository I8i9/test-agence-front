import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getDashboardData = async () => {
      const response = await mainapi.get('/dashboard');
      return response.data; 
}
export default function useFetchDashboard() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: getDashboardData,
        staleTime: 30 * 1000,          // ✅ Data is fresh for 30 seconds
        cacheTime: 30 * 1000,      // ✅ Cache for 5 min even if unused
        refetchInterval: 30 * 1000,    // ✅ Auto refresh every 30s
        refetchOnWindowFocus: true,    // ✅ Refetch when user comes back
        refetchOnMount: true,         // ✅ Don't double-fetch on mount if fresh
        refetchOnReconnect: true,      // ✅ Handle offline recovery
        retry: 3,                      // ✅ Retry failed queries up to 3 times


    });
}
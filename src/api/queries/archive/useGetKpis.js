import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getKpisApi=async(year, month)=>{
      const response = await mainapi.get('/archive/kpi?year='+year+'&month='+month);
      return response.data.data; 
}
export default function useFetchKpis(year, month) {
    return useQuery({
        queryKey: ['archiveKpis', year, month],
        queryFn: () => getKpisApi(year, month),
        enabled: Boolean(year && month), // ✅ only fetch when both exist
        // cacheForm : 30minutes
        staleTime: 30 * 60 * 1000,
        cacheTime: 0,
    });
}
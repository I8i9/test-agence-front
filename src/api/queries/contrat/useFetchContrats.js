import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getContratsapi=async()=>{
      const response = await mainapi.get('/contrat');
      return response.data.data; 
}
export default function useFetchContrats() {
    return useQuery({
        queryKey: ['contrats'],
        queryFn: getContratsapi,
    });
}
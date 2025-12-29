import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getLastPaimentContratapi=async(id)=>{
      const response = await mainapi.get(`/paiement/contrat/LastPaimentContrat/${id}`);
      console.log('Last Paiment Contrat are here ', response.data.data);
      return response.data.data; 
}
export default function useFetchLastPaimentContrat(id) {
  return useQuery({
    queryKey: ['LastPaimentContrat', id], // include id so cache is unique
    queryFn: () => getLastPaimentContratapi(id),
    staleTime: 500000,
  });
}
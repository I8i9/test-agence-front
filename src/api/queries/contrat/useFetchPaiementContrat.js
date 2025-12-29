import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getPaimentContratapi = async (id) => {
  const response = await mainapi.get(`/paiement/contrat/${id}`);
  console.log('Paiements Contrat:', response.data);
  return response.data.data; 
}

export default function useFetchPaimentContrat(id) {
  return useQuery({
    queryKey: ['PaimentsContrat', id],
    queryFn: () => getPaimentContratapi(id),
    enabled: !!id, // Only fetch when id exists
    staleTime: 500000,
  });
}
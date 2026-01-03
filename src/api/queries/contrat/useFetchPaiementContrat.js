import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getPaimentContratapi = async (id) => {
  const response = await mainapi.get(`/paiement/contrat/${id}`);
  console.log('Paiements Contrat:', response.data);
  return response.data.data; 
}

export default function useFetchPaimentContrat(id,options={}) {
  return useQuery({
    queryKey: ['PaimentsContrat', id],
    queryFn: () => getPaimentContratapi(id),
    enabled: !!id && options.enabled, // Only fetch when id exists and enabled is true
    staleTime: 500000,
  });
}
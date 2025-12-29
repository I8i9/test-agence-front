import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getPaimentDepenseapi = async (id) => {
  const response = await mainapi.get(`/paiement/depense/${id}`);
  console.log('Paiements Depense:', response.data);
  return response.data.data; 
}

export default function useFetchPaimentDepense(id , options = {}) {
  return useQuery({
    queryKey: ['PaimentsDepense', id],
    queryFn: () => getPaimentDepenseapi(id),
    enabled: !!id && options.enabled !== false, // Only fetch when id exists and enabled is not explicitly false
    staleTime: 500000,
  });
}
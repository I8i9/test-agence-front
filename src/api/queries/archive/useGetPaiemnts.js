import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getPaiementsApi = async (year, month) => {
  const response = await mainapi.get(`/archive/paiements?year=${year}&month=${month}`);
  return response.data.data;
};

export default function useFetchPaiements(year, month) {
  return useQuery({
    queryKey: ['archivePaiements', year, month],
    queryFn: () => getPaiementsApi(year, month),
    enabled: Boolean(year && month), // ✅ only fetch when both exist
    // staleTime: 0, // optional: avoid re-fetching too often
    staleTime: Infinity,
  });
}
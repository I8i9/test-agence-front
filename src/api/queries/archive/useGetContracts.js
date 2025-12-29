import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getContratsApi = async (year, month) => {
  const response = await mainapi.get(`/archive/contrats?year=${year}&month=${month}`);
  return response.data.data;
};

export default function useFetchContrats(year, month) {
  return useQuery({
    queryKey: ['archiveContrats', year, month],
    queryFn: () => getContratsApi(year, month),
    enabled: Boolean(year && month), // ✅ only fetch when both exist
    // staleTime: 0, // optional: avoid re-fetching too often
    staleTime: Infinity,
  });
}
import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getFacturesApi = async (year, month) => {
  const response = await mainapi.get(`/archive/factures?year=${year}&month=${month}`);
  return response.data.data;
};

export default function useFetchFactures(year, month) {
  return useQuery({
    queryKey: ['archiveFactures', year, month],
    queryFn: () => getFacturesApi(year, month),
    enabled: Boolean(year && month), // ✅ only fetch when both exist
    // staleTime: 0, // optional: avoid re-fetching too often
    staleTime: Infinity,
  });
}
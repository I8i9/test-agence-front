import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getDepensesApi = async (year, month) => {
  const response = await mainapi.get(`/archive/depenses?year=${year}&month=${month}`);
  return response.data.data;
};

export default function useFetchDepenses(year, month) {
  return useQuery({
    queryKey: ['archiveDepenses', year, month],
    queryFn: () => getDepensesApi(year, month),
    enabled: Boolean(year && month), // ✅ only fetch when both exist
    // staleTime: 0, // optional: avoid re-fetching too often
    staleTime: Infinity,
  });
}
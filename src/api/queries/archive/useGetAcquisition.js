import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getAcquisition = async (year, month) => {
  const response = await mainapi.get(`/archive/acquisitions?year=${year}&month=${month}`);
  return response.data.data;
};

export default function useFetchAcquisitions(year, month) {
  return useQuery({
    queryKey: ['archiveAcquisitions', year, month],
    queryFn: () => getAcquisition(year, month),
    enabled: Boolean(year && month), // ✅ only fetch when both exist
    staleTime: 30
    // staleTime: 0, // optional: avoid re-fetching too often
  });
}
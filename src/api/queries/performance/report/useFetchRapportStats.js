import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

const fetchRapportStatsApi = async (payload) => {
  const response = await mainapi.post('/performance/rapport/stats', payload );
  console.log('fetch rapport stats', response.data);
  return response.data;
};

export const useFetchRapportStats = (payload) => {
  return useQuery({
    queryKey: ['RapportStats', payload],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 5000));
      return fetchRapportStatsApi(payload);
    },
    enabled: !!payload?.type && !!payload?.value && !!payload?.date_debut && !!payload?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
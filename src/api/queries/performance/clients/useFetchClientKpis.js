import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

const fetchClientKpisApi = async (payload) => {
  const response = await mainapi.get('/performance/clients/kpi', { params: payload });
  console.log('fetch client kpi', response.data);
  return response.data;
};

export const useFetchClientKpis = (payload) => {
  return useQuery({
    queryKey: ['ClientKpis'],
    queryFn: () => fetchClientKpisApi(payload),
    enabled: !!payload?.date_debut && !!payload?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
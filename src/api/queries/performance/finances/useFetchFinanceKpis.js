
import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

const fetchFinanceKpisApi = async (payload) => {
  const response = await mainapi.get('/performance/finance/kpi', { params: payload });
  console.log('fetch finance kpi', response.data);
  return response.data;
};

export const useFetchFinanceKpis = (payload) => {
  return useQuery({
    queryKey: ['FinanceKpis', payload],
    queryFn: () => fetchFinanceKpisApi(payload),
    enabled: !!payload?.date_debut && !!payload?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
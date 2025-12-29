import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

const fetchOperationsKpisApi = async (payload) => {
  const response = await mainapi.get('/performance/operations/kpi',{ params: payload });  
  console.log('fetch operations kpi',response.data)
  return response.data;
};

export const useFetchOperationsKpis = (payload) => {
  return useQuery({
    queryKey: ['OperationsKpis', payload],
    queryFn: () => fetchOperationsKpisApi(payload),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
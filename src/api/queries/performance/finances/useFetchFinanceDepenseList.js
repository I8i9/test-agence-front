import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

const fetchDepensesListApi = async (params) => {
  const response = await mainapi.get('/performance/finance/list/depenses', { params });
  console.log('fetch expenses pie chart', response.data);
  return response.data;
};

export const useFetchDepensesList = (params) => {
  return useQuery({
    queryKey: ['DepensesList', params],
    queryFn: () => fetchDepensesListApi(params),
    enabled: !!params?.date_debut && !!params?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
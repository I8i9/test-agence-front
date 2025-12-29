// Create this file: useFetchFinanceLocationsList.js
import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

const fetchLocationsListApi = async (params) => {
  const response = await mainapi.get('/performance/finance/list/locations', { 
    params 
  });
  console.log('fetch locations list', response.data);
  return response.data;
};

export const useFetchLocationsList = (params) => {
  return useQuery({
    queryKey: ['LocationsList', params],
    queryFn: () => fetchLocationsListApi(params),
    enabled: !!params?.date_debut && !!params?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
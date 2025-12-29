import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

const fetchClientTypesApi = async () => {
  const response = await mainapi.post('/performance/client/types', {});
  console.log('fetch client types', response.data);
  return response.data;
}; 

export const useFetchClientTypes = () => {
  return useQuery({
    queryKey: ['ClientTypes'],
    queryFn: () => fetchClientTypesApi(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}; 
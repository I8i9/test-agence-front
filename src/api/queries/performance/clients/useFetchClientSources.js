import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

const fetchClientSourcesApi = async () => {
  const response = await mainapi.post('/performance/client/sources', {});
  console.log('fetch client sources', response.data);
  return response.data;
}; 

export const useFetchClientSources = () => {
  return useQuery({
    queryKey: ['ClientSources'],
    queryFn: () => fetchClientSourcesApi(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}; 
import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

const fetchClientRegionsApi = async () => {
  const response = await mainapi.post('/performance/client/regions', {});
  console.log('fetch client regions', response.data);
  return response.data;
};
export const useFetchClientRegions = () => {
  return useQuery({
    queryKey: ['ClientRegions'],
    queryFn: () => fetchClientRegionsApi(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
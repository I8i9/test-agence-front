import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

const fetchRappelsApi = async () => {
  const response = await mainapi.get('/rappels');

  return response.data.data;
};

const useFetchRappels = () => {
  return useQuery({
    queryKey: ['rappels'],
    queryFn: fetchRappelsApi,
    staleTime: Infinity, 
  });
};

export default useFetchRappels;
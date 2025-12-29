import { useQuery } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";

const fetchOffreApi = async () => {
  const response = await mainapi.get('/offre');

  return response.data.data;
};

const useFetchOffre = () => {
  return useQuery({
    queryKey: ['offre'],
    queryFn: fetchOffreApi,
    staleTime: Infinity, 
  });
};

export default useFetchOffre;

import { useQuery } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";

const fetchFournisseurApi = async () => {
  const response = await mainapi.get('/fournisseur');

  return response.data.data;
};

const useFetchFournisseur = () => {
  return useQuery({
    queryKey: ['fournisseurs'],
    queryFn: fetchFournisseurApi,
    staleTime: Infinity, 
  });
};

export default useFetchFournisseur;
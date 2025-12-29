import { useQuery } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";

const fetchDepenseApi = async () => {
  const response = await mainapi.get('/depense');

  return response.data.data;
};

const useFetchDepense = () => {
  return useQuery({
    queryKey: ['depense'],
    queryFn: fetchDepenseApi,
    staleTime: Infinity, 
  });
};

export default useFetchDepense;
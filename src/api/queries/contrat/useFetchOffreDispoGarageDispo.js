import { useQuery } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";

const fetchGarageOffreDisponibleApi = async (payload) => {
  console.log("Fetching garage offre Disponible with payload:", payload);
  const response = await mainapi.get('/offre/disponible', { params: payload });
  
  return response.data.data;
};

export function useFetchGarageOffreDispo (payload) {
    return useQuery({
        queryKey: ['garageOffreDisponible'],
        queryFn: () => fetchGarageOffreDisponibleApi(payload),    
        staleTime: 0, // 30 seconds
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
}
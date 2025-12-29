import { useQuery } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";

const fetchGarageDisponibleApi = async () => {
  const response = await mainapi.get('/garage/disponible');

  console.log("offre Disponible data",response.data.data);
  return response.data.data;
};

export function useFetchGarageDispo () {
  return useQuery({
    queryKey: ['garageDispo'],
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    queryFn: fetchGarageDisponibleApi 
    });
};
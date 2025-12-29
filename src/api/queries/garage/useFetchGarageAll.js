import { useQuery } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";

const fetchGarageAll = async () => {
  const response = await mainapi.get('/garage/all');
  return response.data.data;
};

export function useFetchGarageAll () {
  return useQuery({
    queryKey: ['garageAll'],
    staleTime: 0,
    queryFn: fetchGarageAll,
    });
};
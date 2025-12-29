import { useQuery } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";

const fetchPromoApiById = async (id) => {
  const response = await mainapi.get(`/promo/${id}`);
  return response.data.data;
};

const useFetchPromoeById = (id) => {
  return useQuery({
    queryKey: ['promo',id],
    queryFn: () => fetchPromoApiById(id),
    enabled: !!id,                        
    staleTime: '10s',
  });
};
export default useFetchPromoeById
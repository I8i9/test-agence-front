import { useQuery } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";

const fetchOffreApiById = async (id) => {
  const response = await mainapi.get(`/offre/${id}`);
  console.log('offre by id',response.data.data)
  return response.data.data;
};

const useFetchOffreById = (id) => {
  return useQuery({
    queryKey: ['offre',id],
    queryFn: () => fetchOffreApiById(id),
    staleTime:'Infinity'
  });
};
export default useFetchOffreById

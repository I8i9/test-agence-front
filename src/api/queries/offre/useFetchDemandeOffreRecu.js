import { useQuery } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";

const fetchDemandeOffreRecuApi = async (id) => {
  const response = await mainapi.get(`/demande/recu/${id}`);  
  console.log('fetch recu count',response.data.data)
  return response.data.data;
};

const useFetchDemandeOffreRecu = (id) => {
  return useQuery({
    queryKey: ['DemandeOffreRecu',id],
    queryFn: () => fetchDemandeOffreRecuApi(id),
    staleTime: Infinity, 
  });
};

export default useFetchDemandeOffreRecu;
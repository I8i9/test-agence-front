import { useMutation, useQueryClient } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";

const addOffreApi = async (offreData) => {
  console.log('dddddddddddddddddd this is the payload ghhhh',offreData)
  const response = await mainapi.post('/offre', offreData);
  console.log("offre created", response.data);
  return response.data;
};

const useAddOffre = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addOffreApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offre'] });
      queryClient.invalidateQueries({ queryKey: ['garage'] });
      
    },
    onError: (error) => {
      console.error("Error creating offre:", error);
    }
  });
};

export default useAddOffre;
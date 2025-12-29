import { useMutation, useQueryClient } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";

const ReOpenOfferApi = async (payload) => {
  const response = await mainapi.post(`/offre/reopen/${payload.id_offre}`, payload); 
  return response.data.data;
};

const useReOpenOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ReOpenOfferApi,
    onSuccess: (data) => {
      // Invalidate and refetch offre data after successful creation
      queryClient.invalidateQueries({ queryKey: ['offre'] });
      queryClient.invalidateQueries({ queryKey: ['garage'] });
      
      console.log("Offre created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating offre:", error);
    }
  });
};

export default useReOpenOffer;
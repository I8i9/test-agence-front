import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"; 
import { useQueryClient } from "@tanstack/react-query";
import mainapi from "../../axios/main.api.js";

const UpdateGarageAvailabilityapi = async (payload) => {
  const response = await mainapi.patch(`/garage/availability/${payload.id_garage}`, payload);
  return response.data.data
};

export function useUpdateGarageAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:  UpdateGarageAvailabilityapi, 
    onSuccess:(data)=>{
      console.log(data)
    },
    onError: () => {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    },
    onSuccess: (_, variables) => {
      const id_garage = variables.id_garage;
      queryClient.invalidateQueries(["garage"]);
      queryClient.invalidateQueries(["DetailGarage", id_garage]);
      queryClient.invalidateQueries(['countGarage']);

    },
  });
}
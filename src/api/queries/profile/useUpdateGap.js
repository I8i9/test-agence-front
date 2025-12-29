import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import mainapi from "../../axios/main.api.js";
import { useStore } from "../../../store/store.js";

const updateGapApi = async (updatePayload) => {
  console.log(updatePayload);
  const response = await mainapi.patch(`/profile/gap/${updatePayload}`,{});
  return response;
};
export const useUpdateGap = () => {
  return useMutation({
    mutationFn: updateGapApi,
    onError: () => {
      toast.error(
          "Oups, la mise à jour a échoué. Veuillez réessayer."
      );
    },
    onSuccess: (_, variables) => {
        console.log("Update gap successful",variables);
      if(variables){
        toast.success("Le délai entre les réservations a été mis à jour avec succès !");
        useStore.getState().setThreshold(variables);
      }
    },
  });
};

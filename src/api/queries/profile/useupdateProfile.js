import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import mainapi from "../../axios/main.api.js";
import { useStore } from "../../../store/store.js";

const updateProfileapi = async (updatePayload) => {
  console.log(updatePayload);
  const response = await mainapi.patch("/profile", updatePayload);
  return response;
};
export const useUpdateData = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (updatePayload) => {
      if (!("logo" in updatePayload)) {
        updatePayload.logo = null;
      }
      const response = await updateProfileapi(updatePayload);
      return { responseData: response.data, updatePayload };

    },
    onError: () => {
      toast.error(
          "Oups, la mise à jour a échoué. Veuillez réessayer."
      );
    },
    onSuccess: ({updatePayload }) => {

      toast.success("Votre profil a été mis à jour avec succès");
      if(updatePayload.name_agency){
          useStore.getState().setNameAgency(updatePayload.name_agency);
      }
      client.invalidateQueries(["profile"])  
    },
  });
};

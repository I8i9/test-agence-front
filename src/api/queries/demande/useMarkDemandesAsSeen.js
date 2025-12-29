import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"; 
import { useQueryClient } from "@tanstack/react-query";
import mainapi from "../../axios/main.api.js";

const updateDemandeApi = async (payload) => {
  const response = await mainapi.patch(`/demande/seen/${payload.id_demande}`, payload);
  return response.data;
};

export function useUpdateDemandeSeen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:  updateDemandeApi, 
    onError: () => {
      toast.error("Erreur lors de la mise à jour de la demande. is seen");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["demande"]);
      queryClient.invalidateQueries(["countDemand"]);
    },
  });
}
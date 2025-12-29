import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"; 
import { useQueryClient } from "@tanstack/react-query";
import mainapi from "../../axios/main.api.js";

const updatedemandapi = async (payload) => {
    console.log("Updating demande:",  payload);
    const response = await mainapi.patch(`/demande/${payload.id_demande}`, { status_demande: payload.status_demande , raison_annulation_demande : payload.raison });
    return response.data;
};

export function useUpdateDemande() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:  updatedemandapi, 
    onError: () => {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    },
    onSuccess: (_, variables) => {
      const id_demande = variables.id_demande;
      queryClient.invalidateQueries(["demande"]);
      queryClient.invalidateQueries(["DetailDemande", id_demande]);
    },
  });
}
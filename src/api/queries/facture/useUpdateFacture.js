import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"; 
import { useQueryClient } from "@tanstack/react-query";
import mainapi from "../../axios/main.api.js";

const updatefactureapi = async ( {payload , id} ) => {
    const response = await mainapi.patch(`/facture/${id}`, {payload});
    return response.data;
};

export function useUpdateFacture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:  updatefactureapi, 
    onError: () => {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    },
    onSuccess: (data, variables) => {
      const id = variables.id;
      const date = data.date_facture.split('-');
      if (id) queryClient.invalidateQueries(["DetailFacture", id]);
      queryClient.invalidateQueries(["archiveFactures", date[0], date[1]]);
      queryClient.invalidateQueries(["archiveKpis", date[0], date[1]]);
      toast.success("Facture mise à jour avec succès.");
    },
  });
}
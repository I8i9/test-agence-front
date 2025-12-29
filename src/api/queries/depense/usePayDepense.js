import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const usePayDepenseApi = async (payload) => {
  console.log("payload in usePayDepenseApi", payload);
  const response = await mainapi.post('/paiement/depense',payload);
  return response.data.data;
}

export function usePayDepense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usePayDepenseApi,
    onSuccess: (data,variables) => {
      const date_paiement = variables.date_paiement.split('-');
      const year = date_paiement[0];
      const month = date_paiement[1];
      const date_depense = data.date_depense.split('-');
      queryClient.invalidateQueries(['archivePaiements', year, month]);
      queryClient.invalidateQueries(['archiveDepenses', date_depense[0], date_depense[1]]);
      queryClient.invalidateQueries(['archiveKpis', date_depense[0], date_depense[1]]);
      queryClient.invalidateQueries(['archiveKpis', year, month]);
      toast.success('Paiement enregistré avec succès');
      queryClient.invalidateQueries(['depenses']); 
    },
    onError: () => {
      toast.error('Erreur lors de l\'enregistrement du paiement');
    }
  });
}
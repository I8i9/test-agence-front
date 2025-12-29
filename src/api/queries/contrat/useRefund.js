import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const usePayContratApi = async (payload) => {
  console.log("payload in usePayContratApi", payload);
  const response = await mainapi.post('/paiement/remboursement',payload);
  return response.data;
}

export function useRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usePayContratApi,
    onSuccess: (data) => {
      toast.success('Remboursement enregistré avec succès');
      const date = data.date_paiement.split('-');
      const dateCr = data.date_creation.split('-');
      queryClient.invalidateQueries(['contrats']); 
      queryClient.invalidateQueries(['archiveFactures' , date[0], date[1]]);
      queryClient.invalidateQueries(['archiveContrats' , dateCr[0], dateCr[1]]);
      queryClient.invalidateQueries(['archiveKpis' , date[0], date[1]]);
    },
    onError: () => {
      toast.error('Erreur lors de l\'enregistrement du paiement');
    }
  });
}
import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useUpdateDepenseApi = async (payload) => {
    
  const response = await mainapi.patch(`/depense/archive/${payload.id_depense}`,payload);
  return response.data;
}

export function useUpdateDepense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: useUpdateDepenseApi,
    onSuccess: (data, variables) => {
      const date = data.date_depense.split('-');
      const year = date[0];
      const month = date[1];
      toast.success('Dépense modifiée avec succès');
      queryClient.invalidateQueries(['DetailDepense', variables.id_depense]);
      queryClient.invalidateQueries(['depenses']);
      queryClient.invalidateQueries(['archiveDepenses', year, month]);
      queryClient.invalidateQueries(['archiveKpis', year, month]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification de la depense');
    }
  });
}
import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const useDeleteFactureApi = async (id) => {
    const response = await mainapi.delete(`/facture/${id}`);
    return response.data;
}

export function useDeleteFacture() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useDeleteFactureApi,
        onError: (error) => {
            if(error.response) {
                if(error.response.status === 404) {
                    toast.error("La facture n'existe pas.");
                } else if(error.response.status === 400) {
                    toast.error(error.response.data.message || "Une erreur s'est produite lors de la suppression. Veuillez réessayer.");
                } else {
                    toast.error("Oups ! Une erreur s'est produite lors de la suppression. Veuillez réessayer.");
                }
            }
        },
        onSuccess: (data,variables) => {
            const date = data.date_facture.split('-');
            const year = date[0];
            const month = date[1];
             queryClient.invalidateQueries(['DetailFacture', variables]);
            queryClient.invalidateQueries(['archiveFactures', year, month]); 
            queryClient.invalidateQueries(['archiveContrats']);
            queryClient.invalidateQueries(['archiveKpis', year, month]);
            toast.success('Votre facture a été supprimée.');
        },
    });
}
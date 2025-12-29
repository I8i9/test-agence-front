import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const useDeleteFournisseurApi = async (id) => {
    const response= await mainapi.delete(`/fournisseur/${id}`);
    return response.data;
}
export function useDeleteFournisseur() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useDeleteFournisseurApi,
        onError: (error) => {
            if(error.response) {
                if(error.response.status === 404) {
                    toast.error("La dépense n'existe pas.");
                } else if(error.response.status === 400) {
                    toast.error(error.response.data.message || "Une erreur s’est produite lors de la suppression. Veuillez réessayer.");
                } else {
                    toast.error("Oups ! Une erreur s’est produite lors de la suppression. Veuillez réessayer.");
                }
            }
        },
        onSuccess: (_,variables) => {
            queryClient.invalidateQueries(['fournisseurs']);
            queryClient.invalidateQueries(['countClientFournisseurs']);
            queryClient.removeQueries({ queryKey:['DetailFournisseur' , variables] });   
            toast.success('Votre fournisseur a été supprimée.');
        },
    });
}
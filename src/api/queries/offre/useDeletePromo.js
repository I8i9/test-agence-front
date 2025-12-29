import { useMutation, useQueryClient } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { toast } from "sonner";

const deletePromoApi = async (id) => {
    const response = await mainapi.delete(`/promo/${id}`);
    return response.data;
}

export function useDeletePromo({ onSuccess: onSuccessCallback, onError: onErrorCallback } = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePromoApi,
        onError: (error) => {
            if(error.response) {
                if(error.response.status === 404) {
                    toast.error("L'offre n'existe pas");
                } else if(error.response.status === 400) {
                    toast.error(error.response.data.message || "Une erreur s’est produite lors de la suppression. Veuillez réessayer.");
                } else {
                    toast.error("Oups ! Une erreur s’est produite lors de la suppression. Veuillez réessayer.");
                }
            }
            if (onErrorCallback) onErrorCallback(error);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(['Offre']);
            toast.success('La promotion a été désactivée avec succès.');
            if (onSuccessCallback) onSuccessCallback(variables);
        }
    });
}

import { deleteAccount } from "../../axios/accounts.api.js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";  
import { useQueryClient } from "@tanstack/react-query";

export function useDeleteAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAccount,
        onError: () => {
            toast.error( "Oups ! Une erreur s’est produite. Veuillez réessayer.");
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["accounts"]);
            queryClient.invalidateQueries(["historique"]);

            toast.success("Compte supprimé avec succès.");
            
        },
    });
}
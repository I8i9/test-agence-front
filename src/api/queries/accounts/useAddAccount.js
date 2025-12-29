import { addAccount } from "../../axios/accounts.api.js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"; 
import { useQueryClient } from "@tanstack/react-query";
export function useAddAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => addAccount(payload),
        onError: (error) => {

            if( error.response.status === 400 || error.response.status === 403) {
                toast.error(error.response.data.message );
            }else {
                toast.error("Oups ! Une erreur s’est produite. Veuillez réessayer.");
                console.error("Erreur lors de l'ajout du compte :", error);
            }
        },
        onSuccess: () => {
            toast.success("Compte ajouté avec succès."); 
            queryClient.invalidateQueries(["accounts"]);
            queryClient.invalidateQueries(["historique"]);

        },
    });
}
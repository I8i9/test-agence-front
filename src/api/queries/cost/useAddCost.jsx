import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; 
import mainapi from "../../axios/main.api";
const useAddCostApi=(payload)=>{
    console.log("payload in useAddCostApi", payload);
    const response=mainapi.post('/depense',payload)
    return response.data
}
export function useAddCost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useAddCostApi,
        onError: (error) => {
            if( error.response) {
                toast.error(error.response.data.message );
            }else {
                toast.error("Oups ! Une erreur s’est produite. Veuillez réessayer.");
                console.error("Erreur lors de l'ajout du compte :", error);
            }
        },
        onSuccess: (_,variables) => {
            const { id_garage } = variables;
            queryClient.invalidateQueries(['depense' , id_garage]);
            queryClient.invalidateQueries(['depense']);
            queryClient.invalidateQueries(['countDepense']);


            toast.success('Votre dépense a été enregistrée avec succès.');
        },
    });
}
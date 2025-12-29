import { useMutation } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const confirmRappelapi=async (data)=>{ 
    const response= await mainapi.patch(`/rappels/confirm/${data.id}`,{})
    return response.data.data;
}
export function useConfirmRappel() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: confirmRappelapi,
         onError: (error) => {
            toast.error("Oups ! Une erreur s’est produite. Veuillez réessayer.");
            console.error("Erreur lors de l'ajout du compte :", error); 
        },
        onSuccess: (_,variables) => {
            client.invalidateQueries(['reminders']);
            client.invalidateQueries(['rappels']);
            client.invalidateQueries(['countDepense']);
            client.removeQueries({ queryKey:['DetailRappel' , variables.id] });   
            if (variables.show) {
                toast.success("Le rappel confirmé avec succès.");
            }
        },
    });
}

export default useConfirmRappel
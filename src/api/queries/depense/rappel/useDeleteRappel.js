import { useMutation } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const deleteRappelApi = async (id) => {
    const response= await mainapi.delete(`/rappels/${id}`);
    return response.data;
}
export function useDeleteRappel() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: deleteRappelApi,
        onError: (error) => {
            if(error.response) {
                if(error.response.status === 404) {
                    toast.error("Le rappel n'existe pas.");
                } else if(error.response.status === 400) {
                    toast.error(error.response.data.message || "Une erreur s’est produite lors de la suppression. Veuillez réessayer.");
                } else {
                    toast.error("Oups ! Une erreur s’est produite lors de la suppression. Veuillez réessayer.");
                }
            }
        },
        onSuccess: (_,variables) => {
            

            client.invalidateQueries(['countDepense']);
            client.invalidateQueries(['rappels']); // checked
            client.invalidateQueries(['reminders']);
            client.removeQueries({ queryKey:['DetailRappel' , variables] });   
            toast.success('Votre rappel a été supprimée.');
        },
    });
}
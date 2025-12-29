import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useDeleteGarageApi = async (id) => {
    console.log("payload in useDeleteGarageApi", id);
    const response= await mainapi.delete(`/garage/${id}`);
    return response.data;
}
export function useDeleteGarage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useDeleteGarageApi,
        onError: (error) => {
            if(error.response) {
                if(error.response.status === 404) {
                    toast.error("La voiture n'existe pas dans la flotte.");
                } else if(error.response.status === 400) {
                    toast.error(error.response.data.message || "Une erreur s’est produite lors de la suppression. Veuillez réessayer.");
                } else {
                    toast.error("Oups ! Une erreur s’est produite lors de la suppression. Veuillez réessayer.");
                }
            }
        },
        onSuccess: (_,variables) => {
            queryClient.invalidateQueries(['garage']);
            queryClient.invalidateQueries(['DetailGarage' , variables]);
            queryClient.invalidateQueries(['countGarage']);
            queryClient.invalidateQueries(['archiveAcquisitions']);
            queryClient.invalidateQueries(['archiveKpis']);

            toast.success('Votre voiture a été retirée de la flotte.');
        },
    });
}
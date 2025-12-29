import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const useDeleteDepenseApi = async (id) => {
    const response= await mainapi.delete(`/depense/${id}`);
    return response.data;
}
export function useDeleteDepense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useDeleteDepenseApi,
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
        onSuccess: (data,variables) => {
            const returnedDate = data.date_dep.split('-');
            const year = returnedDate[0];
            const month = returnedDate[1];
            queryClient.invalidateQueries(['depense']);
            queryClient.invalidateQueries(['countDepense']);
            queryClient.invalidateQueries(['archiveKpis', year, month]);
            queryClient.invalidateQueries(['archiveDepenses', year, month]);
            queryClient.invalidateQueries(['DetailDepense' , variables]);
        },
    });
}
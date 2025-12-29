import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useExtendContratApi=async (payload)=>{
    const response= await mainapi.patch('/contrat/extend',payload)
    return response.data;
}
export function useExtendContrat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useExtendContratApi,
        onSuccess: (data, variables) => {
            const date = data.date_creation.split('-');
            queryClient.invalidateQueries(['contrats']); 
            queryClient.invalidateQueries(['archiveContrats', date[0], date[1]]);
            queryClient.invalidateQueries(['archiveKpis', date[0], date[1]]);
            queryClient.invalidateQueries(['Detailcontrat',variables.id_contrat]);
            queryClient.invalidateQueries(['next', variables.id_contrat]);
            
            toast.success(data.message || "Le contrat a été prolongé avec succès.");
        },
        onError:(error)=>
            toast.error(error.response.data.message)
    });
}
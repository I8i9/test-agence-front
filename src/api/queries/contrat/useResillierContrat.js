import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useResillierContratApi=async (payload)=>{
    console.log("payload in useResillierContratApi", payload);
    const response= await mainapi.patch('/contrat/resilier',payload)
    return response.data.data;
}




export function useResillierContrat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useResillierContratApi,
        onSuccess: (data, variables) => {
            toast.success('Contrat résilié avec succès')
            const date = data.date_creation.split('-');
            const offer = data.offre;
            queryClient.invalidateQueries(['contrats']); 
            queryClient.invalidateQueries(['archiveContrats', date[0], date[1]]);
            queryClient.invalidateQueries(['archiveKpis', date[0], date[1]]);
            queryClient.invalidateQueries(['Detailcontrat',variables.id_contrat]);
            queryClient.invalidateQueries(['next', variables.id_contrat]);
            queryClient.invalidateQueries(['reservations', offer]);

        },
        onError:(error)=>{
            toast.success(error.response.data.message)
        }
    });
}
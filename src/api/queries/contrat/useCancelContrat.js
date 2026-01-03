import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const cancelContratApi=async (payload)=>{
    console.log("payload in useCancelContratApi", payload);
    const response= await mainapi.patch('/contrat/cancel',payload)
    return response.data;
}




export function useCancelContrat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelContratApi,
        onSuccess: (data, vars) => {
            const id_contrat = vars?.id_contrat;
            const date = data?.date_creation.split('-');
            const offer = data?.offre;
            toast.success( data?.message || 'Contrat résilié avec succès')
            queryClient.invalidateQueries(['contrats']); 
            if (date){
                queryClient.invalidateQueries(['archiveContrats', date[0], date[1]]);
                queryClient.invalidateQueries(['archiveKpis', date[0], date[1]]);
            }
            if (id_contrat) {
                queryClient.invalidateQueries(['next', id_contrat]);
                queryClient.invalidateQueries(['Detailcontrat', id_contrat]);

            }
            if (offer)  queryClient.invalidateQueries(['reservations', offer]);

             
        },
        onError:(error)=>{
            toast.success(error.response.data.message)
        }
    });
}
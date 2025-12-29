import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useCloturerContratApi=async (payload)=>{
    console.log("payload in useCloturerContratApi", payload);
    const response= await mainapi.patch('/contrat/close',payload)
    return response.data;
}
export function useCloturerContrat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useCloturerContratApi,
        onSuccess: (data,vars) => {
            const date = data.date_creation.split('-');
            const offer = data.offre;
            queryClient.invalidateQueries(['contrats']); 
            queryClient.invalidateQueries(['archiveContrats', date[0], date[1]]);
            queryClient.invalidateQueries(['archiveKpis', date[0], date[1]]);
            queryClient.invalidateQueries(['next', vars.id_contrat]);
             queryClient.invalidateQueries(['reservations', offer]);

            console.log("Contrat clôturé avec succès");
            toast.success(data.message || "Le contrat a été clôturé avec succès.");
        },
    });
}
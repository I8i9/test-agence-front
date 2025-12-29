import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";

const useAddContratSpApi=async (payload)=>{
    console.log("payload in useAddContratApi", payload);
    const response= await mainapi.post('/contrat/contratSP',payload)
    return response.data;
}
export function useAddContratSp() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useAddContratSpApi,
        onSuccess: (data) => {
            const date = data.date_creation?.split('-')
            const year = date[0]
            const month = date[1];
            const offre = data.offre;
            queryClient.invalidateQueries(['contrats']); 
            queryClient.invalidateQueries(['archiveContrats', year, month]);
            queryClient.invalidateQueries(['archiveKpis', year, month]);
            queryClient.invalidateQueries(["reservations",offre]);
        },
    });
}
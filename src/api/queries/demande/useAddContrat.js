import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";

const addContratApi=async (payload)=>{
    console.log("payload in useAddContratApi", payload);
    const response= await mainapi.post('/contrat',payload)
    return response.data.data;
}
export function useAddContrat() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addContratApi,
        onSuccess: (_,payload) => {
            queryClient.invalidateQueries(['contrats']);
            queryClient.invalidateQueries(['demandes']);
            queryClient.removeQueries(['DetailDemande', payload.id_demande]);

        },
    });
}
import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";

const useAddDepenseApi=async (payload)=>{ 
    const response= await mainapi.post('/depense',payload)
    return response.data.data;
}
export function useAddDepense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useAddDepenseApi,
        onSuccess: (_,variables) => {
            const date = new Date(variables.date_depense);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            queryClient.invalidateQueries(['depense']);
            queryClient.invalidateQueries(['countDepense']);
            queryClient.invalidateQueries(['archiveDepenses', year, month]);
            queryClient.invalidateQueries(['archiveKpis', year, month]);
            
        },
    });
}

export default useAddDepense
import { useMutation } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";

const useAddRappelApi=async (payload)=>{ 
    const response= await mainapi.post('/rappels',payload)
    return response.data.data;
}
export function useAddRappel() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: useAddRappelApi,
        onSuccess: () => {
            
            client.invalidateQueries(['rappels']);
            client.invalidateQueries(['reminders']);
            client.invalidateQueries(['countDepense']);
            
        },
    });
}

export default useAddRappel
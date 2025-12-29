import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";

const useAddFournisseurApi=async (payload)=>{ 
    const response= await mainapi.post('/fournisseur',payload)
    return response.data.data;
}
export function useAddFournisseur() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useAddFournisseurApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['fournisseurs']);
            queryClient.invalidateQueries(['countClientFournisseurs']);
            
        },
    });
}

export default useAddFournisseur
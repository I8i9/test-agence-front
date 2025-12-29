import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";

const UpdateFournisseurApi=async (payload)=>{ 
    const response= await mainapi.put(`/fournisseur/${payload.id_fournisseur}`,payload)
    return response.data.data;
}
export function useUpdateFournisseur() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: UpdateFournisseurApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['fournisseurs']);
            queryClient.invalidateQueries(['countClientFournisseurs']);
            
        },
    });
}

export default useUpdateFournisseur
import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";

const useAddGarageApi=async (payload)=>{
    console.log("payload in useAddGarageApi", payload);
    const response= await mainapi.post('/garage',payload)
    return response.data.data;
}
export function useAddGarage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useAddGarageApi,
        onSuccess: (_,payload) => {
            const date_achat = payload.achat.split('-');
            const year = date_achat[0];
            const month = date_achat[1];
            console.log("year and month in useAddGarage", year, month);
            queryClient.invalidateQueries(['garage']);
            queryClient.invalidateQueries(['archiveAcquisitions', year, month]);
            queryClient.invalidateQueries(['archiveKpis', year, month]);
            

        },
    });
}
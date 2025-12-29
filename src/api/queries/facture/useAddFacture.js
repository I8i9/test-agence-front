import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useAddFactureApi=async (payload)=>{ 
    const response= await mainapi.post('/facture',
        {
            date_facture: payload.date_facture,
            date_echeance_facture: payload.date_echeance_facture,
            reference_facture: payload.reference_facture,
            contrats: payload.contrats,
        }
    )
    return response.data.data;
}
export function useAddFacture() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: useAddFactureApi,
        onSuccess: (_,variables) => {
            const date_facture = variables?.date_facture.split('-');
            const year = date_facture[0];
            const month = date_facture[1];
            queryClient.invalidateQueries(['archiveFactures', year, month]);
            queryClient.invalidateQueries(['archiveContrats' ]);
            queryClient.invalidateQueries(['archiveKpis', year, month]);

            toast.success(`Facture ${variables?.reference_facture} générée avec succès`);          
        },
        onError: () => {
            toast.error(`Erreur lors de la génération de la facture`);
        }
    });
}

export default useAddFacture
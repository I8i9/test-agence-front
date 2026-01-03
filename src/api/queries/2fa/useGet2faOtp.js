import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import mainapi from '../../axios/main.api.js';

const getOtp2faApi = async () => {
    const response = await mainapi.post(`/auth/2fa/enable`,{});
    return response;
};

export function useGet2faOtp(options={}) {
    
    return useMutation({
        mutationFn: (getOtp2faApi),
        enabled: options?.enabled ?? true,
        onError: (error) => {
            if (error.response) {
                console.error("Error response:", error.response.data.message);
            } else if (error.request) {
                console.error("No response received:", error.request);

            } else {
                console.error("Error message:", error.message);
            }

            if(error.response && error.response.status !== 429) {
                toast.error( "Oups ! Une erreur s’est produite. Veuillez réessayer.");
            }else if (error.response && error.response.status === 429) {
                toast.error("Trop de tentatives. Vous ne pouvez pas demander un nouveau code pour le moment.");
            }
        },
    });
}
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import mainapi from '../../axios/main.api.js';

const getOtp2faApi = async (payload) => {
    const response = await mainapi.post(`/auth/2fa/disable`,payload);
    return response;
};

export function useGet2faDisableOtp(payload,options={}) {
    
    return useMutation({
        mutationFn: (getOtp2faApi),
        enabled: options?.enabled ?? true,
        onError: (error) => {
            if(error.response && error.response.status !== 429 && error.response.status !== 400) {
                toast.error( "Oups ! Une erreur s’est produite. Veuillez réessayer.");
            }else if (error.response && error.response.status === 429) {
                toast.error(error?.response?.data?.error || "Trop de tentatives. Veuillez réessayer plus tard.");
            }
        },
    });
}
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import mainapi from '../../axios/main.api.js';



const verify2faOtpApi = async (payload) => {
    const response = await mainapi.post(`/auth/2fa/verify-setup`, payload);
    return response.data;
};


export function useVerifyOtp2fa() {

    
    return useMutation({
        mutationFn: (verify2faOtpApi),

        onError: (error) => {
            if (error.response) {
                console.error("Error response:", error.response.data.message);
            } else if (error.request) {
                console.error("No response received:", error.request);

            } else {
                console.error("Error message:", error.message);
            }

            if(error.response && error.response.status === 500) {
                toast.error("Une erreur interne s’est produite. Veuillez réessayer plus tard.");
            }
        },
    });
}
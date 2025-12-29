import { useMutation } from "@tanstack/react-query";
import { verifyOtpApi } from "../../axios/auth.api.js";
import { toast } from "sonner";

export function useVerifyOtp() {
    
    return useMutation({
        mutationFn: (verifyOtpApi),
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
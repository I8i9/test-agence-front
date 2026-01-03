import { useMutation } from "@tanstack/react-query";
import { get2FAOtpApi } from "../../axios/auth.api.js";
import { toast } from "sonner";

export function useGet2FAOtp() {
    
    return useMutation({
        mutationFn: (get2FAOtpApi),
        onError: (error) => {
            if (error.response) {
                console.error("Error response:", error.response.data.message);
            } else if (error.request) {
                console.error("No response received:", error.request);

            } else {
                console.error("Error message:", error.message);
            }
            toast.error(error.response.data.message || "Oups ! Une erreur s’est produite. Veuillez réessayer.");
        },
    });
}
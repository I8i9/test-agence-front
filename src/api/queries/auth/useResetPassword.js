import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "../../axios/auth.api.js";
import { toast } from "sonner";
import { useStore } from "../../../store/store.js";

export function useResetPassword() {
    const user = useStore((state) => state.user);
    
    return useMutation({
        mutationFn: (resetPasswordApi),
        onError: (error) => {
            if (error.response) {
                console.error("Error response:", error.response.data.message);
            } else if (error.request) {
                console.error("No response received:", error.request);

            } else {
                console.error("Error message:", error.message);
            }
            toast.error(error.response?.data.message || "Oups ! Une erreur s’est produite. Veuillez réessayer.");
        },
        onSuccess: () => {
            // check if its for forget password or change password
            if( !user?.token) {
                toast.success("Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.");
            }
            
        },
    });
}
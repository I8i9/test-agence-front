import { useMutation } from "@tanstack/react-query";
import { FAloginApi } from "../../axios/auth.api.js";
import { useStore } from "../../../store/store.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useVerify2FALogin() {
    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);
    const initializeSocket = useStore((state) => state.initializeSocket);

    return useMutation({
        mutationFn: FAloginApi,

        onError: (error) => {
            if (error.response) {
                const { status, data } = error.response;

                if (status === 400 || status === 401) {
                    toast.error(data.message || "Code invalide ou expiré.");
                } 
                else if (status === 429) {
                    toast.error(data.message || "Trop de tentatives. Veuillez réessayer plus tard.");
                } 
                else {
                    toast.error("Une erreur s’est produite. Veuillez réessayer.");
                }
            } 
            else if (error.request) {
                toast.error("Impossible de contacter le serveur.");
            } 
            else {
                console.error(error);
                toast.error("Erreur inconnue.");
            }
        },

        onSuccess: ({ data }) => {
            setUser(data.data);
            initializeSocket(data.data.token);

            toast.success("Connexion réussie !");
            navigate("/dashboard", { replace: true });
        },
    });
}

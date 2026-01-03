import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { useRefresh } from "../auth/useRefresh";
import { toast } from "sonner";

const addSubscriptionApi = async (subscriptionData) => {
  const response = await mainapi.post('/abonnement/renouveler', subscriptionData);
  return response.data;
};

const useAddSubscription = () => {
  const {mutate : refresh} = useRefresh();
  return useMutation({
    mutationFn: addSubscriptionApi,
    onSuccess:async () => {
        // refresh token 

      toast.success("Abonnement renouvelé avec succès !");
      await refresh();
    },
    onError: (error) => {
      toast.error("Une erreur est survenue. Veuillez réessayer ou contacter le support.");
      console.error("Error creating offre:", error);
    }
  });
};

export default useAddSubscription;
import { useMutation, useQueryClient } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { toast } from "sonner";

const addPromoApi = async (payload) => {
  const response = await mainapi.post("/promo", payload);
  return response.data.data;
};

export function useAddPromo({ onSuccess: customOnSuccess, onError: customOnError } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPromoApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["offre"]);
      toast.success("Promotion créée avec succès");

      if (customOnSuccess) customOnSuccess(data); 
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Une erreur est survenue");

      if (customOnError) customOnError(error);
    },
  });
}

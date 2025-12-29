import { useMutation, useQueryClient } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { toast } from "sonner";

const UpdateOfferStatusApi = async (payload) => {
  const { id_offre, status_offre } = payload;
  const response = await mainapi.patch(`/offre/status/${id_offre}`, {status_offre,});
  return response.data.message;
};

const useUpdateOfferStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: UpdateOfferStatusApi,
    onSuccess: (data) => {
      toast.success(data)
      queryClient.invalidateQueries({ queryKey: ['offre'] });
      queryClient.invalidateQueries({ queryKey: ['garage'] });
    },
  });
};

export default useUpdateOfferStatus;
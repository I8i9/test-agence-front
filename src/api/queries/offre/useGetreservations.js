import { useQuery } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";
import { toast } from "sonner";

const fetchReservationsApi = async (id) => {
  try {
    const response = await mainapi.get(`/offre/reservations/${id}`);
    return response.data.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        return [];
      }
      if (error.response.status === 400 || error.response.status >= 500) {
   
        toast.error("Internal server error");
      }
    }
    throw error; 
  }
};

const useFetchreservations = (id) => {
  return useQuery({
    queryKey: ["reservations", id],
    queryFn: () => fetchReservationsApi(id),
    staleTime: Infinity,
  });
};

export default useFetchreservations;

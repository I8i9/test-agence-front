import { useQuery } from "@tanstack/react-query";
import mainapi from "../../axios/main.api";

const searchGuestByCinApi = async (cin) => { 
    const response = await mainapi.get('/contrat/cin', {
        params: { cin }
    });
    return response.data;
};

export function useSearchGuestByCin(cin) {
    return useQuery({
        queryFn: () => searchGuestByCinApi(cin),
        queryKey: ['guestByCin', cin],
        enabled: false,
        retry: false,
    });
}

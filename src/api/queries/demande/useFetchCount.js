import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getDemandeCountApi = async () => {
    const response = await mainapi.get(`/demande/count`);
    return response.data.data;
};

export const useFetchDemandeCount = () => {
    return useQuery({
        queryKey: ['countDemand'],
        staleTime: 30 * 1000,
        queryFn: () => getDemandeCountApi()
    });
};
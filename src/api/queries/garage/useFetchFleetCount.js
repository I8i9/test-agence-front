import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getGarageCountApi = async () => {
    const response = await mainapi.get(`/abonnement/fleet`);
    return response.data.data;
};

export const useFetchFleetCount = () => {
    return useQuery({
        queryKey: ['countFleet'],
        staleTime: 30 * 1000,
        queryFn: () => getGarageCountApi()
    });
};
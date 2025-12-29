import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getClientContratsApi = async (id_client) => {
    const response = await mainapi.get(`/contrat/clientHistory/${id_client}`);
    return response.data;
};

export const useFetchClientContrats = (id_client) => {
    return useQuery({
        queryFn: () => getClientContratsApi(id_client),
        queryKey: ['ClientsContrats', id_client],
        staleTime: Infinity, // 2 minute
    });
}
import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getClientAgenceApi = async () => {
    const response = await mainapi.get(`/contrat/clients`);
    return response.data.data;
};

export const useFetchClientAgence = () => {
    return useQuery({
        queryFn: getClientAgenceApi,
        queryKey: ['ClientsAgence'],
        staleTime: Infinity, // 2 minute
    });
}
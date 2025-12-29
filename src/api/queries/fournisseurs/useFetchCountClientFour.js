import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getClientFourCountApi = async () => {
    const response = await mainapi.get(`/fournisseur/count`);
    return response.data.data;
};

export const useFetchClientFourCount = () => {
    return useQuery({
        queryKey: ['countClientFournisseurs'],
        staleTime: 30 * 1000,
        queryFn: () => getClientFourCountApi()
    });
};
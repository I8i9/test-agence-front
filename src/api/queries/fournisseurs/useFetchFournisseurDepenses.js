import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getFournisseurDepensesApi = async (id) => {
    const response = await mainapi.get(`/fournisseur/depenses/${id}`);
    return response.data.data;
};

export const useFetchFournisseurDepenses = (id) => {
    return useQuery({
        queryKey: ['FournisseurDepenses', id],
        staleTime: 30 * 1000,
        queryFn: () => getFournisseurDepensesApi(id)
    });
};
import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getDepenseCountApi = async () => {
    const response = await mainapi.get(`/depense/count`);
    return response.data.data;
};

export const useFetchDepenseCount = () => {
    return useQuery({
        queryKey: ['countDepense'],
        staleTime: 30 * 1000,
        queryFn: () => getDepenseCountApi()
    });
};
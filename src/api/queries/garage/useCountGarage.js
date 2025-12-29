import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getGarageCountApi = async () => {
    const response = await mainapi.get(`/garage/count`);
    return response.data.data;
};

export const useFetchGarageCount = () => {
    return useQuery({
        queryKey: ['countGarage'],
        staleTime: 30 * 1000,
        queryFn: () => getGarageCountApi()
    });
};
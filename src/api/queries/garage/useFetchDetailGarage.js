import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getdetailcarapi = async (id_garage) => {
    const response = await mainapi.get(`/garage/byId/${id_garage}`);
    return response.data.data;
};

export const useFetchDetailGarage = (id_garage , options = {}) => {
    return useQuery({
        queryKey: ['DetailGarage', id_garage],
        staleTime: Infinity,
        enabled: !!id_garage && options.enabled,
        queryFn: () =>getdetailcarapi(id_garage)

    });
};
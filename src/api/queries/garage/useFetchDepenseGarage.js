import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getdepensecarapi = async (id_garage) => {
    const response = await mainapi.get(`/garage/depense/${id_garage}`);
    console.log('garage depense data', response.data.data);
    return response.data.data;
};

export const useFetchDepenseGarage = (id_garage) => {
    return useQuery({
        queryKey: ['depense', id_garage],
        staleTime: Infinity,
        queryFn: () => getdepensecarapi(id_garage) 
    });
};
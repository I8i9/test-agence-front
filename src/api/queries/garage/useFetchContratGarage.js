import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getcontratcarapi = async (id_garage) => {
    const response = await mainapi.get(`/garage/contrat/${id_garage}`);
    console.log('garage depense data', response.data.data);
    return response.data.data;
};

export const useFetchContratGarage = (id_garage) => {
    return useQuery({
        queryKey: ['contrat', id_garage],
        staleTime: Infinity,
        queryFn: () =>
            new Promise((resolve) => {
                setTimeout(async () => {
                    const data = await getcontratcarapi(id_garage);
                    resolve(data);
                }, 1500); // 1.5 seconds delay to simulate loading
            }),
    });
};
import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getdetaildepenseapi = async (id_depense) => {
    const response = await mainapi.get(`/depense/byId/${id_depense}`);
    console.log('depense detail data', response.data.data);
    return response.data.data;
};

export const useFetchDetailDepense = (id_depense , options = {}) => {
    return useQuery({
        queryKey: ['DetailDepense', id_depense],
        staleTime: Infinity,
        enabled: !!id_depense && options.enabled,
        queryFn: () =>
            new Promise((resolve) => {
                setTimeout(async () => {
                    const data = await getdetaildepenseapi(id_depense);
                    resolve(data);
                }, 1500); // 1.5 seconds delay to simulate loading
            }),
    });
};
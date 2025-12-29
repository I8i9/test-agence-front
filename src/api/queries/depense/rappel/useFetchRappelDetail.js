import { useQuery } from '@tanstack/react-query';
import mainapi from '../../../axios/main.api.js';

const getdetailrappelapi = async (id_rappel) => {
    const response = await mainapi.get(`/rappels/byId/${id_rappel}`);
    console.log('rappel detail data', response.data.data);
    return response.data.data;
};

export const useFetchDetailRappel = (id_rappel , options = {}) => {
    return useQuery({
        queryKey: ['DetailRappel', id_rappel],
        staleTime: Infinity,
        enabled: !!id_rappel && options.enabled,
        queryFn: () => getdetailrappelapi(id_rappel)
    });
};
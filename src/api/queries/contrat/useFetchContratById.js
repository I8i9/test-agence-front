import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getdetailcontratapi = async (id) => {
    const response = await mainapi.get(`/contrat/${id}`);
    return response.data.data;
};

export const useFetchDetailContrat = (id) => {
    return useQuery({
        queryKey: ['Detailcontrat', id],
        staleTime: Infinity,
        enabled: !!id,
        queryFn: () => getdetailcontratapi(id), 

    });
};

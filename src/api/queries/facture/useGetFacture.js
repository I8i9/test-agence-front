import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getDetailFactureApi = async (id_facture) => {
    const response = await mainapi.get(`/facture/byId/${id_facture}`);
    return response.data.data;
};

export const useFetchFactureDetail = (id_facture , options = {}) => {
    return useQuery({
        queryKey: ['DetailFacture', id_facture],
        staleTime: Infinity,
        enabled: !!id_facture && options.enabled,
        queryFn: () => getDetailFactureApi(id_facture),
    });
};
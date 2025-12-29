import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getDetailDemandeApi = async (id_demande) => {
    const response = await mainapi.get(`/demande/byId/${id_demande}`);
    console.log('demande detail data', response.data.data);
    return response.data.data;
};

export const useFetchDetailDemande = (id_demande) => {
    return useQuery({
        queryKey: ['DetailDemande', id_demande],
        staleTime: Infinity,
        queryFn: () => getDetailDemandeApi(id_demande)
    });
};
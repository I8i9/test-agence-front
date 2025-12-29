import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getArchiveDetailDepenseapi = async (id_depense) => {
    console.log('id_depense', id_depense);
    const response = await mainapi.get(`/depense/archive/byId/${id_depense}`); 
    console.log('archive depense detail data', response.data.data);
    return response.data.data;
};

export const useFetchArchiveDetailDepense = (id_depense) => {
    return useQuery({
        queryKey: ['ArchiveDetailDepense', id_depense],
        staleTime: Infinity,
        enabled: !!id_depense,
        queryFn: () => getArchiveDetailDepenseapi(id_depense),
    });
};
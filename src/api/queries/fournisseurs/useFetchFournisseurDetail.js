import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getdetailFournisseurapi = async (id_Fournisseur) => {
    const response = await mainapi.get(`/fournisseur/byId/${id_Fournisseur}`);
    console.log('Fournisseur detail data', response.data.data);
    return response.data.data;
};

export const useFetchDetailFournisseur = (id_Fournisseur , options = {}) => {
    return useQuery({
        queryKey: ['DetailFournisseur', id_Fournisseur],
        staleTime: Infinity,
        enabled: !!id_Fournisseur && options.enabled,
        queryFn: () =>
            new Promise((resolve) => {
                setTimeout(async () => {
                    const data = await getdetailFournisseurapi(id_Fournisseur);
                    resolve(data);
                }, 1500); // 1.5 seconds delay to simulate loading
            }),
    });
};
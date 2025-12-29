import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getNextReservationApi = async (id_contrat) => {
    console.log('this is id garage inside the api',id_contrat)
    const response = await mainapi.get(`reservations/next/${id_contrat}`);
    return response.data;
};

export const useFetchNextReservation = (id_contrat) => {
    return useQuery({
        queryKey:['next',id_contrat],
        staleTime:0,
        queryFn: () => getNextReservationApi(id_contrat)
    });
};
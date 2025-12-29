import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const checkEmailapi = async (email) => {
    const response = await mainapi.get(`/client/email/${email}`);
    return response.data.exists;
};

export const useCheckEmail = (email) => {
    return useQuery({
        queryFn: () => checkEmailapi(email),
        queryKey: ['checkedEmail', email],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: !!email,
        staleTime: 600000, // 10 minute
    });
}

const checkPhoneapi = async (phone) => {
    const response = await mainapi.get(`/client/phone/${phone}`);
    return response.data.exists;
};

export const useCheckPhone = (phone) => {
    return useQuery({
        queryFn: () => checkPhoneapi(phone),
        queryKey: ['checkedPhone', phone],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: !!phone,
        staleTime: 600000, // 10 minute
    });
}
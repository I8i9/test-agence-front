import { useQuery } from '@tanstack/react-query';
import mainapi from '../../../axios/main.api';

const getFetchSelects = async () => {
    const response = await mainapi.get("/garage/select/");
    return response.data.data;
};

export const useGetSelects = ( options = {}) => {
    return useQuery({
        queryKey: ['reportSelects'],
        staleTime: 60000, // 1 min
        enabled: options.enabled,
        queryFn: () => getFetchSelects(),
    });
};
import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getBrandsApi = async () => {
    const response = await mainapi.get(`/cars/getBrands`);
    return response.data.data;
};

const getModelsApi = async (Brand) => {
    const response = await mainapi.get(`/cars/getModels`, { params: { Brand } });
    return response.data.data;
}

const getVersionsApi = async (Brand, Model) => {
    const response = await mainapi.get(`/cars/getVersions`, { params: { Brand, Model } });
    return response.data.data;
}

export const useFetchBrands = () => {
    return useQuery({
        queryFn: getBrandsApi,
        queryKey: ['Brands'],
        staleTime: 120000, // 2 minute
    });
}

export const useFetchModels = (Brand , options = {}) => {
    return useQuery({
        queryFn: () => getModelsApi(Brand),
        enabled: !!Brand && options.enabled,
        queryKey: ['Models', Brand],
        staleTime: 120000, // 2 minute
    });
}

export const useFetchVersions = (Brand, Model , options = {}) => {
    return useQuery({
        queryFn: () => getVersionsApi(Brand, Model),
        queryKey: ['Versions', Brand, Model],
        staleTime: 120000, // 2 minute
        enabled: !!Brand && !!Model && options.enabled,
    });
}

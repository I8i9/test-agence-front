import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';

const getOldKilometrageapi=async(id)=>{
      const response = await mainapi.get(`/garage/oldkilometrage/${id}`);
      console.log('old kilometrage are here ', response.data.data);
      return response.data.data; 
}
export default function useFetchOldKilometrage(id , options={}) {
  return useQuery({
    queryKey: ['OldKilometrage', id], // include id so cache is unique
    queryFn: () => getOldKilometrageapi(id),
    staleTime: 500000,
    enabled: options.enabled, // only fetch when kilometrage is not provided eihe null or undefined
  });
}

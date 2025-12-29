import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';


const getDemandesapi=async()=>{
      const response = await mainapi.get('/demande');
      console.log('demandes data',response.data.data)
      return response.data.data;

}
export function useFetchDemandes() {
  return useQuery({
    queryKey: ['demandes'],
    staleTime:Infinity,
    queryFn:getDemandesapi ,
    })
  }
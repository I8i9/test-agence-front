import { useQuery } from '@tanstack/react-query';
import mainapi from '../../axios/main.api.js';


const getcarsapi=async()=>{
      const response = await mainapi.get('/garage');
      console.log('garage data',response.data.data)
      return response.data.data;

}
export function useFetchGarage() {
  return useQuery({
    queryKey: ['garage'],
    staleTime:Infinity,
    queryFn:getcarsapi ,
    })
  }
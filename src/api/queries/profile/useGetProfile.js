import { useQuery } from "@tanstack/react-query";
import mainapi from "../../axios/main.api.js"; 

// API call function
const Getprofileapi = async () => {
  const response = await mainapi.get('/profile');
  console.log(response.data.data)
  return response.data.data; 
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: Getprofileapi, 

    //refetch only changes happen
    refetchOnWindowFocus: false,
    staleTime : Infinity, // Prevent refetching
    cacheTime: Infinity, // Keep data in cache indefinitely
  });
};



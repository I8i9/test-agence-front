import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '../../axios/accounts.api.js';

const useGetAccounts = (options={}) => {
    return(useQuery({
        queryKey: ['accounts'],
        queryFn: getAccounts,
        staleTime: Infinity,
        enabled : options?.enabled
      }));
}

export default useGetAccounts
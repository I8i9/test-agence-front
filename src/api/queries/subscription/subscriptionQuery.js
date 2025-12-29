import { useQuery } from '@tanstack/react-query'
import { fetchSubscription } from '../../axios/subscription.api.js';


export const useAgencySubscription = (options={}) => {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: fetchSubscription ,
    cacheTime: 0,             // don't keep in cache
    staleTime: 0,             // always consider stale
    enabled : options?.enabled,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchInterval: false,
    })
}
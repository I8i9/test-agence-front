import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

// ============================================
// API FETCH FUNCTIONS
// ============================================

const fetchRevenueByTypeApi = async ({ date_debut, date_fin }) => {
  const response = await mainapi.get('/performance/finance/radar/revenue-by-type', {
    params: { date_debut, date_fin }
  });
  console.log('fetch revenue by type radar', response.data);
  return response.data;
};

const fetchDepensesByTypeApi = async ({ date_debut, date_fin }) => {
  const response = await mainapi.get('/performance/finance/radar/depenses-by-type', {
    params: { date_debut, date_fin }
  });
  console.log('fetch depenses by type radar', response.data);
  return response.data;
};

const fetchMargeBruteByTypeApi = async ({ date_debut, date_fin }) => {
  const response = await mainapi.get('/performance/finance/radar/marge-brute-by-type', {
    params: { date_debut, date_fin }
  });
  console.log('fetch marge brute by type radar', response.data);
  return response.data;
};

const fetchTauxMargeBruteByTypeApi = async ({ date_debut, date_fin }) => {
  const response = await mainapi.get('/performance/finance/radar/taux-marge-brute-by-type', {
    params: { date_debut, date_fin }
  });
  console.log('fetch taux marge brute by type radar', response.data);
  return response.data;
};

// ============================================
// REACT QUERY HOOKS FOR EACH RADAR CHART
// ============================================

export const useFetchRevenueByType = (payload) => {
  return useQuery({
    queryKey: ['RevenueByTypeRadar', payload],
    queryFn: () => fetchRevenueByTypeApi(payload),
    enabled: !!payload?.date_debut && !!payload?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchDepensesByType = (payload) => {
  return useQuery({
    queryKey: ['DepensesByTypeRadar', payload],
    queryFn: () => fetchDepensesByTypeApi(payload),
    enabled: !!payload?.date_debut && !!payload?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchMargeBruteByType = (payload) => {
  return useQuery({
    queryKey: ['MargeBruteByTypeRadar', payload],
    queryFn: () => fetchMargeBruteByTypeApi(payload),
    enabled: !!payload?.date_debut && !!payload?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchTauxMargeBruteByType = (payload) => {
  return useQuery({
    queryKey: ['TauxMargeBruteByTypeRadar', payload],
    queryFn: () => fetchTauxMargeBruteByTypeApi(payload),
    enabled: !!payload?.date_debut && !!payload?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// ============================================
// MASTER HOOK - Fetches based on selected data type
// ============================================

export const useFetchFinanceRadarByType = (dataKey, payload) => {
  const hooksMap = {
    'revenu': useFetchRevenueByType,
    'depense': useFetchDepensesByType,
    'brut': useFetchMargeBruteByType,
    'taux_brut': useFetchTauxMargeBruteByType,
  };

  const selectedHook = hooksMap[dataKey] || useFetchRevenueByType;
  return selectedHook(payload);
};
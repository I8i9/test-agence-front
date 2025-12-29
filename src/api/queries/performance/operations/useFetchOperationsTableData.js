import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

// ============================================
// API FETCH FUNCTIONS
// ============================================

const fetchTopOffersApi = async ({ date_debut, date_fin }) => {
  const response = await mainapi.get('/performance/operations/table/top-offers', {
    params: { date_debut, date_fin }
  });
  console.log('fetch top offers table', response.data);
  return response.data;
};

const fetchTopPromosApi = async ({ date_debut, date_fin }) => {
  const response = await mainapi.get('/performance/operations/table/top-promos', {
    params: { date_debut, date_fin }
  });
  console.log('fetch top promos table', response.data);
  return response.data;
};

const fetchTopDurationsApi = async ({ date_debut, date_fin }) => {
  const response = await mainapi.get('/performance/operations/table/top-durations', {
    params: { date_debut, date_fin }
  });
  console.log('fetch top durations table', response.data);
  return response.data;
};

const fetchTopLocationsApi = async ({ date_debut, date_fin }) => {
  const response = await mainapi.get('/performance/operations/table/top-locations', {
    params: { date_debut, date_fin }
  });
  console.log('fetch top locations table', response.data);
  return response.data;
};

const fetchTopVehicleTypesApi = async ({ date_debut, date_fin }) => {
  const response = await mainapi.get('/performance/operations/table/top-vehicle-types', {
    params: { date_debut, date_fin }
  });
  console.log('fetch top vehicle types table', response.data);
  return response.data;
};

const fetchTopFailureReasonsApi = async ({ date_debut, date_fin }) => {
  const response = await mainapi.get('/performance/operations/table/top-failure-reasons', {
    params: { date_debut, date_fin }
  });
  console.log('fetch top failure reasons table', response.data);
  return response.data;
};

// ============================================
// REACT QUERY HOOKS FOR EACH TABLE
// ============================================

export const useFetchTopOffers = (payload) => {
  return useQuery({
    queryKey: ['TopOffersTable', payload],
    queryFn: () => fetchTopOffersApi(payload),
    enabled: !!payload?.date_debut && !!payload?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchTopPromos = (payload) => {
  return useQuery({
    queryKey: ['TopPromosTable', payload],
    queryFn: () => fetchTopPromosApi(payload),
    enabled: !!payload?.date_debut && !!payload?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchTopDurations = (payload) => {
  return useQuery({
    queryKey: ['TopDurationsTable', payload],
    queryFn: () => fetchTopDurationsApi(payload),
    enabled: !!payload?.date_debut && !!payload?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchTopLocations = (payload) => {
  return useQuery({
    queryKey: ['TopLocationsTable', payload],
    queryFn: () => fetchTopLocationsApi(payload),
    enabled: !!payload?.date_debut && !!payload?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchTopVehicleTypes = (payload) => {
  return useQuery({
    queryKey: ['TopVehicleTypesTable', payload],
    queryFn: () => fetchTopVehicleTypesApi(payload),
    enabled: !!payload?.date_debut && !!payload?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchTopFailureReasons = (payload) => {
  return useQuery({
    queryKey: ['TopFailureReasonsTable', payload],
    queryFn: () => fetchTopFailureReasonsApi(payload),
    enabled: !!payload?.date_debut && !!payload?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// ============================================
// MASTER HOOK - Fetches based on selected table type
// ============================================

export const useFetchOperationsTableByType = (tableType, payload) => {
  const hooksMap = {
    'offre': useFetchTopOffers,
    'promo': useFetchTopPromos,
    'duree': useFetchTopDurations,
    'lieu': useFetchTopLocations,
    'Type': useFetchTopVehicleTypes,
    'echec': useFetchTopFailureReasons,
  };

  const selectedHook = hooksMap[tableType] || useFetchTopOffers;
  return selectedHook(payload);
};
import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

// ============================================
// API FETCH FUNCTIONS
// ============================================

const fetchClicksChartApi = async (payload) => {
  const response = await mainapi.post('/performance/operations/chart/clicks', payload);
  console.log('fetch clicks chart', response.data);
  return response.data;
};

const fetchDemandsChartApi = async (payload) => {
  const response = await mainapi.post('/performance/operations/chart/demands', payload);
  console.log('fetch demands chart', response.data);
  return response.data;
};

const fetchContractsChartApi = async (payload) => {
  const response = await mainapi.post('/performance/operations/chart/contracts', payload);
  console.log('fetch contracts chart', response.data);
  return response.data;
};

const fetchConversionRateChartApi = async (payload) => {
  const response = await mainapi.post('/performance/operations/chart/conversion-rate', payload);
  console.log('fetch conversion rate chart', response.data);
  return response.data;
};

const fetchSuccessRateChartApi = async (payload) => {
  const response = await mainapi.post('/performance/operations/chart/success-rate', payload);
  console.log('fetch success rate chart', response.data);
  return response.data;
};

const fetchOccupationRateChartApi = async (payload) => {
  const response = await mainapi.post('/performance/operations/chart/occupation-rate', payload);
  console.log('fetch occupation rate chart', response.data);
  return response.data;
};

// ============================================
// REACT QUERY HOOKS
// ============================================

export const useFetchClicksChart = (payload) => {
  return useQuery({
    queryKey: ['ClicksChart', payload],
    queryFn: () => fetchClicksChartApi(payload),
    enabled: !!payload?.debut && !!payload?.fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchDemandsChart = (payload) => {
  return useQuery({
    queryKey: ['DemandsChart', payload],
    queryFn: () => fetchDemandsChartApi(payload),
    enabled: !!payload?.debut && !!payload?.fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchContractsChart = (payload) => {
  return useQuery({
    queryKey: ['ContractsChart', payload],
    queryFn: () => fetchContractsChartApi(payload),
    enabled: !!payload?.debut && !!payload?.fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchConversionRateChart = (payload) => {
  return useQuery({
    queryKey: ['ConversionRateChart', payload],
    queryFn: () => fetchConversionRateChartApi(payload),
    enabled: !!payload?.debut && !!payload?.fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchSuccessRateChart = (payload) => {
  return useQuery({
    queryKey: ['SuccessRateChart', payload],
    queryFn: () => fetchSuccessRateChartApi(payload),
    enabled: !!payload?.debut && !!payload?.fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchOccupationRateChart = (payload) => {
  return useQuery({
    queryKey: ['OccupationRateChart', payload],
    queryFn: () => fetchOccupationRateChartApi(payload),
    enabled: !!payload?.debut && !!payload?.fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// ============================================
// MASTER HOOK - Fetches based on selected metric
// ============================================

export const useFetchOperationsChartByMetric = (metric, payload) => {
  const hooksMap = {
    clicks: useFetchClicksChart,
    demands: useFetchDemandsChart,
    contracts: useFetchContractsChart,
    taux_de_conversion: useFetchConversionRateChart,
    taux_de_succes: useFetchSuccessRateChart,
    taux_d_occupence: useFetchOccupationRateChart,
  };

  const selectedHook = hooksMap[metric] || useFetchClicksChart;
  return selectedHook(payload);
};
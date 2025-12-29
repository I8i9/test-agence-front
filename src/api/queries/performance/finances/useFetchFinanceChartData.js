import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

const fetchRevenueChartApi = async (payload) => {
  const response = await mainapi.post('/performance/finance/chart/revenue', payload);
  console.log('fetch revenue chart', response.data);
  return response.data;
}; 

const fetchDepensesChartApi = async (payload) => {
  const response = await mainapi.post('/performance/finance/chart/depenses', payload);
  console.log('fetch depenses chart', response.data);
  return response.data;
};

const fetchRevenueAndDepensesChartApi = async (payload) => {
  const response = await mainapi.post('/performance/finance/chart/revenue-depenses', payload);
  console.log('fetch revenue & depenses chart', response.data);
  return response.data;
};

const fetchGrossMarginChartApi = async (payload) => {
  const response = await mainapi.post('/performance/finance/chart/gross-margin', payload);
  console.log('fetch gross margin chart', response.data);
  return response.data;
};

const fetchGrossMarginRateChartApi = async (payload) => {
  const response = await mainapi.post('/performance/finance/chart/gross-margin-rate', payload);
  console.log('fetch gross margin rate chart', response.data);
  return response.data;
};

// ============================================
// REACT QUERY HOOKS FOR CHARTS
// ============================================

export const useFetchRevenueChart = (payload) => {
  return useQuery({
    queryKey: ['RevenueChart', payload],
    queryFn: () => fetchRevenueChartApi(payload),
    enabled: !!payload?.debut && !!payload?.fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchRevenueAccruedChart = (payload) => {
  return useQuery({
    queryKey: ['RevenueAccruedChart', payload],
    queryFn: () => fetchRevenueAccruedChartApi(payload),
    enabled: !!payload?.debut && !!payload?.fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchDepensesChart = (payload) => {
  return useQuery({
    queryKey: ['DepensesChart', payload],
    queryFn: () => fetchDepensesChartApi(payload),
    enabled: !!payload?.debut && !!payload?.fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchRevenueAndDepensesChart = (payload) => {
  return useQuery({
    queryKey: ['RevenueAndDepensesChart', payload],
    queryFn: () => fetchRevenueAndDepensesChartApi(payload),
    enabled: !!payload?.debut && !!payload?.fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchGrossMarginChart = (payload) => {
  return useQuery({
    queryKey: ['GrossMarginChart', payload],
    queryFn: () => fetchGrossMarginChartApi(payload),
    enabled: !!payload?.debut && !!payload?.fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useFetchGrossMarginRateChart = (payload) => {
  return useQuery({
    queryKey: ['GrossMarginRateChart', payload],
    queryFn: () => fetchGrossMarginRateChartApi(payload),
    enabled: !!payload?.debut && !!payload?.fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// ============================================
// MASTER HOOK - Fetches based on selected metric
// ============================================

export const useFetchFinanceChartByMetric = (metric, payload) => {
  const hooksMap = {
    'revenu': useFetchRevenueChart, 
    'depense': useFetchDepensesChart,
    'revenu&depense': useFetchRevenueAndDepensesChart,
    'brut': useFetchGrossMarginChart,
    'taux_brut': useFetchGrossMarginRateChart,
  };

  const selectedHook = hooksMap[metric] || useFetchRevenueAndDepensesChart;
  return selectedHook(payload);
};
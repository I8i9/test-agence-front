import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";


const fetchDurationPieChartApi = async (params) => {
  const response = await mainapi.get('/performance/finance/piechart/duration', { params });
  console.log('fetch duration pie chart', response.data);
  return response.data;
};

export const useFetchDurationPieChart = (params) => {
  return useQuery({
    queryKey: ['DurationPieChart', params],
    queryFn: () => fetchDurationPieChartApi(params),
    enabled: !!params?.date_debut && !!params?.date_fin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}; 
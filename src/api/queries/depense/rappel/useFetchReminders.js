import { useQuery } from "@tanstack/react-query";
import mainapi from "../../../axios/main.api";

const fetchRemindersApi = async () => {
  const response = await mainapi.get('/rappels/reminders');
  return response.data.data;
};

const useFetchReminders = () => {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: fetchRemindersApi,
    staleTime: Infinity, 
  });
};

export default useFetchReminders;
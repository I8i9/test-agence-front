import axios from "axios";
import { refreshapi } from "./auth.api.js";
import {useStore} from "../../store/store.js"

// Axios instance for making requests

const mainapi = axios.create({
  baseURL: import.meta.env.API_BASE_URL ||  'http://localhost:3000/', 
  withCredentials: true              
});

// Fix: get token & user from store outside React hook in request interceptor
mainapi.interceptors.request.use((config) => {
  const user = useStore.getState().user;  
  const token = user?.token;               
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; 
  }
  return config;
});

mainapi.interceptors.response.use(
  (response) => {
    return response; 
  },
  async (error) => {
    const setUser = useStore.getState().setUser; // change useStore(...) to getState()
    const originalRequest = error.config; 
    if ((error.response?.status === 401 || error.response?.status) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const Response = await refreshapi();
        if (Response.status === 200) {
          setUser(Response.data);
          mainapi.defaults.headers['Authorization'] = `Bearer ${Response.data.token}`; // fix variable name
          return mainapi(originalRequest);
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        // Optionally, you can redirect to login or show a message
        window.location.href = '/login'; // Redirect to login page
      }
    }
    return Promise.reject(error); 
  }
);

export default mainapi;

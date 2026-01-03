// src/axios/pdf.api.js
import axios from "axios";
import { useStore } from "../../store/store.js";

const pdfapi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/",
  withCredentials: true,
  // prevent JSON parsing of binary data
  transformResponse: [(data) => data],
});

// Attach auth token manually (no refresh logic here)
pdfapi.interceptors.request.use((config) => {
  const user = useStore.getState().user;
  const token = user?.token;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default pdfapi;

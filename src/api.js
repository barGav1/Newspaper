import axios from "axios";

const api = axios.create({
  baseURL: "https://resumebackend-production.up.railway.app",
  withCredentials: true,
});

export default api;

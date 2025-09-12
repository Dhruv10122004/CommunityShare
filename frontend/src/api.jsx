// src/api.js
import axios from "axios";

// Create the axios instance with the CORRECT baseURL that includes /api
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`, // 👈 THE FIX IS HERE
});

// Interceptor to attach token to every request (this part stays the same)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
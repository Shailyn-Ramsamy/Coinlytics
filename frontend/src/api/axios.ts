// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Change to match your FastAPI backend
  withCredentials: true,            // Optional: include cookies for auth if needed
});

export default api;

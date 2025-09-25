// src/utils/api.js
// FOr use with httpOnlyCookie
import axios from "axios";
import { logout } from "./auth";

const api = axios.create({ baseURL: "http://127.0.0.1:55505/api" }); // or env var

api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      logout();
      window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);

export default api;

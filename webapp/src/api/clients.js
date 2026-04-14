import axios from "axios";
import { getToken } from "../auth/token";

const FINANCE_API_BASE = import.meta.env.VITE_FINANCE_API_BASE || "http://localhost:5206/api";
// Docker compose maps auth-service as 5100:8080 on host
const AUTH_API_BASE = import.meta.env.VITE_AUTH_API_BASE || "http://localhost:5100/api";

export const financeApi = axios.create({
  baseURL: FINANCE_API_BASE
});

export const authApi = axios.create({
  baseURL: AUTH_API_BASE
});

financeApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getEmailFromTokenPayload(payload) {
  if (!payload) return null;
  return (
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
    payload.email ||
    payload.Email ||
    null
  );
}


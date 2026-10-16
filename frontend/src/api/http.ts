import axios from "axios";
import { notifySessionExpired } from "../lib/session";

function getAccessToken(): string | undefined {
    const key = `oidc.user:${import.meta.env.VITE_OIDC_AUTHORITY}:${import.meta.env.VITE_OIDC_CLIENT_ID}`;
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as { access_token?: string }).access_token : undefined;
}

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

http.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            notifySessionExpired();
        }
        return Promise.reject(error);
    },
);
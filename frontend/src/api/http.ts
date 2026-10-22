import axios from "axios";
import { notifySessionExpired } from "../lib/session";
import { getAccessToken } from "../utils/getAccessToken";

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
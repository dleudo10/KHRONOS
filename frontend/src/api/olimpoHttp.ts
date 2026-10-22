import axios from "axios";
import { getAccessToken } from "../utils/getAccessToken";

export const olimpoHttp = axios.create({
    baseURL: import.meta.env.VITE_OLIMPO_API_URL,
});

olimpoHttp.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});


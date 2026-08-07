import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "";

export function construirUrlApi(path: string): string {
    return `${baseURL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export const api = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
    console.warn(
        "VITE_API_URL não foi definida. As requisições relativas usarão o endereço atual.",
    );
}

export const api = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

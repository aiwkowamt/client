import axios from "axios";
import Cookies from "js-cookie";

let access_token = Cookies.get("token");

const AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

AxiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${access_token}`;
    return config;
});

export default AxiosInstance;
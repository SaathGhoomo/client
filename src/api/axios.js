import axios from "axios";

const STORAGE_TOKEN_KEY = "accessToken";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    console.log('Axios request:', {
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      method: config.method,
      hasToken: !!localStorage.getItem(STORAGE_TOKEN_KEY)
    });

    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem(STORAGE_TOKEN_KEY);

      if (window.location.pathname !== "/signin") {
        window.location.assign("/signin");
      }
    }

    if (import.meta.env.MODE !== "production") {
      // eslint-disable-next-line no-console
      console.error("API Error:", error);
    }

    return Promise.reject(error);
  }
);

export default api;

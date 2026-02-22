import axios from "axios";

const STORAGE_TOKEN_KEY = "accessToken";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (!API_BASE_URL) {
      return Promise.reject(
        new Error(
          "API base URL is not set. Create client/client/.env with VITE_API_BASE_URL=http://localhost:8000/api (or VITE_API_URL) and restart Vite."
        )
      );
    }

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

import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:3000/v1/api", // Replace with your API base URL
  withCredentials: true, // Include credentials (cookies) in requests
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  
  (req) => {

    if (req.skipAuth) return req;

    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }

    return req;
  }
);

api.interceptors.response.use(
  (res) => {
    console.log("LOG FROM RES : ", res);
    return res;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuth
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post("/user/refresh", {}, { skipAuth: true });
        const newAccessToken = refreshResponse.data?.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }

        localStorage.removeItem("accessToken");
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
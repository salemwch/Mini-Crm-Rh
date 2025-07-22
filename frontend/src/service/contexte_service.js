import axios from 'axios';

const HTTP = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};
const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};
HTTP.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => resolve(HTTP(originalRequest)));
        });
      }
      isRefreshing = true;
      try {
        await HTTP.post('/auth/refresh-token');
        isRefreshing = false;
        onRefreshed();
        return HTTP(originalRequest);
      } catch (err) {
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default HTTP;
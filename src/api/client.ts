import axios from 'axios';
import { API_URL } from '../config';
import { emitUnauthorized } from '../context/authEvents';
import { getToken, deleteToken } from '../utils/tokenStorage';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = new (axios.defaults.headers.constructor as any)({
      ...config.headers,
      Authorization: `Bearer ${token}`,
    });
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      await deleteToken();
      emitUnauthorized();
    }
    return Promise.reject(error);
  }
);
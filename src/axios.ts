import axios from 'axios';
import { API_URL } from './const.ts';

const api = axios.create({
  baseURL: API_URL,
});

export const setAuthHeader = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  delete api.defaults.headers.common['Authorization'];
};

export default api;

import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from '@/utils/token';

export const request = axios.create({
  baseURL: API_BASE_URL,
});

request.interceptors.request.use(async (config) => {
  return config;
});

request.interceptors.response.use((response) => {
  return response.data;
});

export const serverRequest = axios.create({
  baseURL: API_BASE_URL,
});

serverRequest.interceptors.request.use(async (config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const { data }: any = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh: refreshToken,
        });
        setAccessToken(data?.accessToken);
        config.headers.Authorization = `Bearer ${data.accessToken}`;
      } catch (e) {
        clearTokens();
      }
    }
  }

  return config;
});

serverRequest.interceptors.response.use((response) => {
  return response.data;
});

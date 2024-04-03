import Cookies from 'js-cookie';

export const ACCESS_TOKEN_KEY = 'chain_zoom_access_token';
export const REFRESH_TOKEN_KEY = 'chain_zoom_refresh_token';

export const EXPIRED_ACCESS_TOKEN = new Date(new Date().getTime() + 15 * 60 * 1000);
export const EXPIRED_REFRESH_TOKEN = 30;

export const getAccessToken = () => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const setAccessToken = (value: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, value, {
    expires: EXPIRED_ACCESS_TOKEN,
    sameSite: 'strict',
  });
};
export const setRefreshToken = (value: string) => {
  Cookies.set(REFRESH_TOKEN_KEY, value, {
    expires: EXPIRED_REFRESH_TOKEN,
    sameSite: 'strict',
  });
};

export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};

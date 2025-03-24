import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/auth';

function parsedToken(key: string) {
  const token = sessionStorage.getItem(key) || localStorage.getItem(key);
  if (!token) {
    return;
  }
  try {
    return JSON.parse(token);
  } catch (error) {
    console.error('GET TOKEN PARSE ERROR', error);
  }
}

const getStorageToken = {
  get accessToken() {
    return parsedToken(ACCESS_TOKEN);
  },
  get refreshToken() {
    return parsedToken(REFRESH_TOKEN);
  },
};

const convertToken = (storage: Storage, key: string, value: string) => {
  try {
    const storageValue = JSON.stringify(value);
    storage.setItem(key, storageValue);
  } catch (error) {
    console.error('SET TOKEN PARSE ERROR', error);
  }
};

const setStorageToken = (isRemember = !!localStorage.getItem(ACCESS_TOKEN)) => {
  const storage = isRemember ? localStorage : sessionStorage;
  return {
    accessToken(value: string) {
      convertToken(storage, ACCESS_TOKEN, value);
      return this;
    },
    refreshToken(value: string) {
      convertToken(storage, REFRESH_TOKEN, value);
      return this;
    },
  };
};

const removeStorageToken = () => {
  try {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    sessionStorage.removeItem(ACCESS_TOKEN);
    sessionStorage.removeItem(REFRESH_TOKEN);
  } catch (error) {
    console.error('REMOVE TOKEN ERROR', error);
  }
};

const isSaveLocalStorage = !!localStorage.getItem(ACCESS_TOKEN);

export { isSaveLocalStorage, parsedToken, getStorageToken, removeStorageToken, setStorageToken };

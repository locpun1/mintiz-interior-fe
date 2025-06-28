// src/utils/AuthHelper.ts
import { ACCESS_TOKEN } from '@/constants/auth';

export function setAccessToken(token: string) {
  try {
    localStorage.setItem(ACCESS_TOKEN, token);
  } catch (error) {
    console.error('SET ACCESS TOKEN ERROR', error);
  }
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN);
  } catch (error) {
    console.error('GET ACCESS TOKEN ERROR', error);
    return null;
  }
}

export function removeAccessToken() {
  try {
    localStorage.removeItem(ACCESS_TOKEN);
  } catch (error) {
    console.error('REMOVE ACCESS TOKEN ERROR', error);
  }
}
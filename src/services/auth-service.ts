import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyUsernameRequest,
} from '@/types/auth';
import type { HttpResponse } from '@/types/common';
import HttpClient from '@/utils/HttpClient';
import { UserProfile } from '@/types/user-types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/auth`;

export const signIn = (params: LoginRequest) => {
  return HttpClient.post<typeof params, HttpResponse<LoginResponse>>(`${prefix}/login`, params);
};

export const getCurrentUser = () => {
  return HttpClient.get<HttpResponse<{success: boolean, data: UserProfile}>>(`${prefix}/me`);
};

export const signUp = (params: LoginRequest) => {
  return HttpClient.post<LoginRequest, HttpResponse>(`${prefix}/signup`, params);
};

export const signOut = () => {
  return HttpClient.post<null, HttpResponse>(`${prefix}/logout`, null);
};

export const verifyEmail = (params: VerifyUsernameRequest) => {
  return HttpClient.post<VerifyUsernameRequest, HttpResponse<ResetPasswordResponse>>(
    `${prefix}/verify-email`,
    params,
  );
};

export const resetPassword = (params: ResetPasswordRequest) => {
  return HttpClient.post<ResetPasswordRequest, HttpResponse<ResetPasswordResponse>>(
    `${prefix}/reset-password`,
    params,
  );
};

export const forgotPassword = (params: ForgotPasswordRequest) => {
  return HttpClient.post<ForgotPasswordRequest, HttpResponse<ResetPasswordResponse>>(
    `${prefix}/forgot-password`,
    params,
  );
};

export const changePassword = (data: ChangePasswordRequest) => {
  if(!data) return;
  return HttpClient.put<any, HttpResponse<ChangePasswordRequest>>(
    `${prefix}/change-password`,
    data,
  );
};

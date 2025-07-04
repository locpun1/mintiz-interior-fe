import { HttpResponse } from './common';
import { UserProfile } from './user-types';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserProfile
};

export type ResetPasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type ForgotPasswordRequest = {
  password: string;
  token: string;
};

export type ChangePasswordRequest = {
  password: string;
  is_default: number;
  user_id: string | number
};

export type VerifyUsernameRequest = {
  username: string;
};

export type ResetPasswordResponse = Promise<HttpResponse<string>>;

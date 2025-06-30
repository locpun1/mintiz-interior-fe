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

export type VerifyUsernameRequest = {
  username: string;
};

export type ResetPasswordResponse = Promise<HttpResponse<string>>;

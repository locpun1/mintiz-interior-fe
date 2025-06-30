import type { HttpResponse, PaginatedResponse } from '@/types/common';
import { IUser } from '@/types/user';
import HttpClient from '@/utils/HttpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/users`;

interface GetUsersParams {
  limit?: number;
  page?: number;
  role?: 'admin' | 'employee';
}

type UsersResponse = PaginatedResponse<IUser>;

export const getUsers = (params: GetUsersParams) => {
  return HttpClient.get<any, HttpResponse<UsersResponse>>(`${prefix}`, { params });
};

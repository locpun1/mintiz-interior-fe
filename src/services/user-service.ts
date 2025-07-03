import type { HttpResponse, PaginatedResponse } from '@/types/common';
import { IUser } from '@/types/user';
import { UserProfile } from '@/types/user-types';
import HttpClient from '@/utils/HttpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/users`;

interface GetUsersParams {
  limit?: number;
  page?: number;
  role?: 'admin' | 'employee';
}

export type UsersResponse = PaginatedResponse<IUser>;

export const getUsers = (params: GetUsersParams) => {
  return HttpClient.get<any, HttpResponse<UsersResponse>>(`${prefix}`, { params });
};

export interface CheckoutApiUsersResponse {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: UserProfile; 
}

export interface CheckoutApiUserResponse {
  message: string;
  success: boolean;
  data: UserProfile; 
}

export interface DeleteUserPayload {
  is_deleted: number
}

export const createAccount = (FormData: FormData) => {
  const endpoint = `${prefix}/create-account`;
  return HttpClient.post<FormData, HttpResponse<UserProfile>>(endpoint, FormData);
}

export const updateAccount = (id: string | number, FormData: FormData) => {
  if(!FormData) return;
  return HttpClient.put<FormData, HttpResponse<UserProfile>>(
    `${prefix}/update/${id}`,
    FormData
  )
}

export const getListUsers = async(
  page: number,
  size: number
): Promise<CheckoutApiUsersResponse> => {
  let url = `${prefix}/get-all-users?page=${page}&size=${size}&role=employee`;
  const response = await HttpClient.get<{
    success: boolean,
    message: string,
    data: CheckoutApiUsersResponse;
  }>(url);
  if(response.data && response.success && response.data){
    return response.data;
  }else{
    throw new Error(response.message || 'Failed to fetch list user');
  }
};

export const getUser = async(
  id: string | number
): Promise<CheckoutApiUserResponse> => {
  let url = `${prefix}/${id}`;
  const response = await HttpClient.get<{
    success: boolean,
    message: string,
    data: CheckoutApiUserResponse;
  }>(url);
  if(response.data && response.success && response.data){
    return response.data;
  }else{
    throw new Error(response.message || 'Failed to fetch list user');
  }
}

// export const deleteUser = (id: string | number) => {
//     return HttpClient.patch<any, HttpResponse<UserProfile | null>>(
//         `${prefix}/users/${id}`
//     )
// }

export const deleteUser = async (
  id: string | number,
  payload: DeleteUserPayload
): Promise<HttpResponse<UserProfile>> => {
  const url = `${prefix}/delete/${id}`;
  return HttpClient.patch<UserProfile>(url, payload as any);
};


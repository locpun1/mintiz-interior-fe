// src/services/post-service.ts

import HttpClient from '@/utils/HttpClient';
import type { HttpResponse, PaginatedResponse } from '@/types/common';
import type { IPost } from '@/types/post';
import { UserProfile } from '@/types/user-types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/posts`;
// Định nghĩa interface cho các tham số query
interface GetPostsParams {
  limit?: number;
  page?: number;
  status?: 'pending' | 'approved' | 'rejected';
  authorId?: number;
}

interface GetPostsPublicParams {
  limit?: number;
  page?: number;
  category?: string
}

// Định nghĩa kiểu dữ liệu cho response trả về từ API
export type PostsResponse = PaginatedResponse<IPost>;

export const getPosts = (params: GetPostsParams) => {
  return HttpClient.get<any, HttpResponse<PostsResponse>>(`${prefix}`, { params });
};

export const getPostsPublic = async(
  page: number,
  limit: number,
  category?: string
): Promise<PostsResponse> => {
  let url = `${prefix}/public`;
  const params: Record<string, any> = {
        page: page,
        limit: limit,
  };
  if(category !== undefined && category !== 'Tất cả'){
    params.category = category
  }
  const response = await HttpClient.get<{
    success: boolean,
    message: string,
    data: PostsResponse;
  }>(url, { params });
  if(response.data && response.success && response.data){
    return response.data;
  }else{
    throw new Error(response.message || 'Failed to fetch list user');
  }
};

export const uploadPostImage = (file: File): Promise<HttpResponse<{ imageUrl: string }>> => {
  const formData = new FormData();
  formData.append('image', file);
  
  return HttpClient.post(
    `${prefix}/upload-image`, 
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

export const createPost = (payload: { title: string; content: string; imageUrl?: string }) => {
    return HttpClient.post(`${prefix}`, payload);
};

export const reviewPost = (postId: number, payload: { status: 'approved' | 'rejected', rejectionReason?: string }) => {
  return HttpClient.patch<typeof payload, HttpResponse<IPost>>(`${prefix}/${postId}/review`, payload);
};

export const deletePost = (postId: number) => {
  return HttpClient.delete(`/posts/${postId}`);
};

export const getPostById = (postId: number) => {
  return HttpClient.get<any, HttpResponse<IPost>>(`${prefix}/${postId}`);
};

export const publishPost = (postId: number, payload: { publish: boolean }) => {
  return HttpClient.patch<typeof payload, HttpResponse<IPost>>(
    `${prefix}/${postId}/publish`,
    payload
  );
};

interface UpdatePostPayload {
  title: string;
  content: string;
  category: string;
  imageUrl?: string | null;
  time?: string;
}

export const updatePost = (postId: number, payload: UpdatePostPayload) => {
  return HttpClient.patch<UpdatePostPayload, HttpResponse<IPost>>(
    `${prefix}/${postId}`,
    payload
  );
};

interface TotalPost{
  admin: UserProfile;
  totalPostApproved: number,
  totalPostPending: number
}



export const getTotalPost = (params: GetPostsParams) => {
  let url = `${prefix}/total-post`;
  return HttpClient.get<HttpResponse<TotalPost>>(url, {params})
};
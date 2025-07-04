// src/services/post-service.ts

import HttpClient from '@/utils/HttpClient';
import type { HttpResponse, PaginatedResponse } from '@/types/common';
import type { IPost } from '@/types/post';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/posts`;
// Định nghĩa interface cho các tham số query
interface GetPostsParams {
  limit?: number;
  page?: number;
  status?: 'pending' | 'approved' | 'rejected';
  authorId?: number;
}

// Định nghĩa kiểu dữ liệu cho response trả về từ API
export type PostsResponse = PaginatedResponse<IPost>;

export const getPosts = (params: GetPostsParams) => {
  return HttpClient.get<any, HttpResponse<PostsResponse>>(`${prefix}`, { params });
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
  return HttpClient.patch<typeof payload, HttpResponse<IPost>>(`${prefix}/posts/${postId}/review`, payload);
};

export const deletePost = (postId: number) => {
  return HttpClient.delete(`/posts/${postId}`);
};
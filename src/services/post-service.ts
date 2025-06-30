// src/services/post-service.ts

import HttpClient from '@/utils/HttpClient';
import type { HttpResponse, PaginatedResponse } from '@/types/common';
import type { IPost } from '@/types/post';

// Định nghĩa interface cho các tham số query
interface GetPostsParams {
  limit?: number;
  page?: number;
  status?: 'pending' | 'approved' | 'rejected';
  authorId?: number;
}

// Định nghĩa kiểu dữ liệu cho response trả về từ API
type PostsResponse = PaginatedResponse<IPost>;

export const getPosts = (params: GetPostsParams) => {
  return HttpClient.get<any, HttpResponse<PostsResponse>>('/posts', { params });
};

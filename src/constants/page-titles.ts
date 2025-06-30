// src/constants/page-titles.ts

import { ROUTE_PATH } from './routes'; // Import các hằng số route của bạn

// Dùng Record<string, string> để đảm bảo key và value đều là chuỗi
export const PAGE_TITLES: Record<string, string> = {
  // --- Auth ---
  [ROUTE_PATH.LOGIN]: 'Đăng nhập',
  // [ROUTE_PATH.FORGOT_PASSWORD]: 'Quên mật khẩu',

  // --- Dashboard ---
  [ROUTE_PATH.HOME]: 'Dashboard',

  // --- Posts ---
  [ROUTE_PATH.POSTS]: 'Quản lý Bài viết',
  // [ROUTE_PATH.POST_CREATE]: 'Tạo bài viết mới',
  // [ROUTE_PATH.POST_EDIT]: 'Chỉnh sửa bài viết',

  // --- Contacts ---
  [ROUTE_PATH.CONTACTS]: 'Quản lý Liên hệ',

  // --- Users (Admin) ---
  [ROUTE_PATH.USERS_MANAGEMENT]: 'Quản lý Tài khoản',

  // --- Profile (Employee) ---
  [ROUTE_PATH.MY_PROFILE]: 'Thông tin cá nhân',
  
  // --- Trang không tìm thấy ---
  [ROUTE_PATH.NOT_FOUND]: '404 - Không tìm thấy trang',
};
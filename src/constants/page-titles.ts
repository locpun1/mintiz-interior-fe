// src/constants/page-titles.ts
import { ROUTE_PATH } from './routes'; 

const FULL_PATH = {
  MANAGER_HOME:     `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_HOME}`,     
  MANAGER_ACCOUNT:  `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_ACCOUNT}`, 
  MANAGER_SETTINGS:  `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_SETTINGS}`, 
  MANAGER_CONTACT:  `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MY_PROFILE}`, 
  MANAGER_BLOG:     `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_BLOG}`,     
  BLOG_CREATE:      `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_BLOG}/${ROUTE_PATH.BLOG_CREATE}`,
}

export const PAGE_TITLES: Record<string, string> = {

  [FULL_PATH.MANAGER_HOME]: 'Dashboard',
  [FULL_PATH.MANAGER_ACCOUNT]: 'Quản lý Tài khoản',
  [FULL_PATH.MANAGER_SETTINGS]: 'Quản lý Hình ảnh, Dịch vụ',
  [FULL_PATH.MANAGER_CONTACT]: 'Quản lý Thông tin',
  [FULL_PATH.MANAGER_BLOG]: 'Quản lý Bài viết',
  [FULL_PATH.BLOG_CREATE]: 'Quản lý bài viết/ Tạo bài viết mới/ Tạo bài đăng',
};
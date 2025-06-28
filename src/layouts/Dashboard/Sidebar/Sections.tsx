// src/layouts/Dashboard/Sidebar/Sections.ts

import type { SvgIconComponent } from '@mui/icons-material';
// Import các icon bạn cần
import { HomeOutlined, PeopleOutline, PostAdd, ContactsOutlined } from '@mui/icons-material';

import { ROUTE_PATH } from '@/constants/routes';

// Các interface không đổi
export interface SectionItem {
  title: string;
  path: string;
  children?: SectionItem[];
  icon?: SvgIconComponent;
}

interface Section {
  section: string | null;
  items: SectionItem[];
}

// Hàm Sections bây giờ không cần tham số
const Sections = (): Section[] => [
  {
    section: null, // Không có tiêu đề section
    items: [
      {
        title: 'Trang chủ', // Dùng chuỗi tĩnh
        path: ROUTE_PATH.HOME, // Giả sử bạn có hằng số này
        icon: HomeOutlined,
      },
      {
        title: 'Quản lý Bài viết',
        path: ROUTE_PATH.POSTS, // Thay bằng route của bạn
        icon: PostAdd,
      },
      {
        title: 'Quản lý Liên hệ',
        path: ROUTE_PATH.CONTACTS, // Thay bằng route của bạn
        icon: ContactsOutlined,
      },
    ],
  },
  {
    section: 'Quản trị', // Một section có tiêu đề
    items: [
      {
        title: 'Quản lý Tài khoản',
        path: ROUTE_PATH.USERS, // Thay bằng route của bạn
        icon: PeopleOutline,
      },
    ],
  },
];

export default Sections;
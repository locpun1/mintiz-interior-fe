// src/layouts/Dashboard/Sidebar/Sections.ts

import type { SvgIconComponent } from '@mui/icons-material';
import { 
  HomeOutlined, 
  PostAdd, 
  ContactsOutlined,
  ManageAccountsOutlined, 
  AccountCircleOutlined  
} from '@mui/icons-material';

import { ROUTE_PATH } from '@/constants/routes';
import type { IUser } from '@/types/user';

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

const Sections = (profile: IUser | null): Section[] => {
  if (!profile) {
    return [];
  }

  const menuItems: SectionItem[] = [
    {
      title: 'Trang chủ',
      path: ROUTE_PATH.MANAGE,
      icon: HomeOutlined,
    },
    {
      title: 'Quản lý Bài viết',
      path: ROUTE_PATH.POSTS,
      icon: PostAdd,
    },
    {
        title: 'Đăng xuất',
        path: ROUTE_PATH.CONTACTS,
        icon: ContactsOutlined,
    }
  ];

  let accountItem: SectionItem;

  if (profile.role === 'admin') {
    accountItem = {
      title: 'Quản lý Tài khoản',
      path: ROUTE_PATH.MANAGE_ACCOUNT, 
      icon: ManageAccountsOutlined,
    };
  } else { 
    accountItem = {
      title: 'Quản lý thông tin',
      path: ROUTE_PATH.MY_PROFILE,
      icon: AccountCircleOutlined,
    };
  }
  
  menuItems.splice(1, 0, accountItem);

  return [
    {
      section: null, 
      items: menuItems,
    }
  ];
};

export default Sections;
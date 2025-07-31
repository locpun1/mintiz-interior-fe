// src/layouts/Dashboard/Sidebar/Sections.ts

import type { SvgIconComponent } from '@mui/icons-material';
import { 
  HomeOutlined, 
  PostAdd, 
  ContactsOutlined,
  ManageAccountsOutlined, 
  AccountCircleOutlined,  
  Settings
} from '@mui/icons-material';

import { ROUTE_PATH } from '@/constants/routes';
import type { IUser } from '@/types/user';
import { GroupPermission } from '@/types/permission';
import { mapPermissionsToSectionItems } from '@/utils/data';

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


const Sections = (profile: IUser | null, menuData: GroupPermission | null): Section[] => {
  if (!profile || (profile.role?.toLowerCase().trim() !== 'admin' && !menuData)) {
    return [];
  }

  const sectionItems = menuData ? mapPermissionsToSectionItems(menuData) : [];


  const menuItems: SectionItem[] = [
      {
        title: 'Trang chủ',
        path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_HOME}`,
        icon: HomeOutlined,
      },
      {
        title: 'Quản lý Tài khoản',
        path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_ACCOUNT}`,
        icon: ManageAccountsOutlined,
      },
      {
        title: 'Quản lý Bài viết',
        path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_BLOG}`,
        icon: PostAdd,
      },
      {
        title: 'Quản lý Hình ảnh, Dịch vụ...',
        path: `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_SETTINGS}`,
        icon: Settings
      },    
    ];

  const isAdmin = profile.role?.toLowerCase().trim() === 'admin';
  let accountItem: SectionItem[] = isAdmin ? menuItems : sectionItems;

  return [
    {
      section: null, 
      items: accountItem,
    }
  ];
};

export default Sections;
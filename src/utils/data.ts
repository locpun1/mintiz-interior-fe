import { SectionItem } from '@/layouts/Dashboard/Sidebar/Sections';
import { GroupPermission } from '@/types/permission';
import {
  HomeOutlined,
  PostAdd,
  ContactsOutlined,
  ManageAccountsOutlined,
  AccountCircleOutlined,
  Settings
} from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';

export const iconMap: Record<string, SvgIconComponent> = {
  HomeOutlined,
  PostAdd,
  ContactsOutlined,
  ManageAccountsOutlined,
  AccountCircleOutlined,
  Settings
};

export const mapPermissionsToSectionItems = (group: GroupPermission): SectionItem[] => {
  return group.permission.map((perm) => ({
    title: perm.name,
    path: perm.path,
    icon: perm.icon ? iconMap[perm.icon] : undefined, // fallback nếu icon không hợp lệ
  }));
};
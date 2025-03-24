import type { ListItemMenuItem } from '../components/ListItemMenu';

// Icons
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import GroupsIcon from '@mui/icons-material/Groups';
import ListIcon from '@mui/icons-material/List';
const customers: ListItemMenuItem = {
  title: 'Khách hàng',
  children: [
    {
      title: 'Khách hàng',
      icon: <ListIcon />,
      to: '/customers',
    },
    {
      title: 'Chăm sóc khách hàng',
      icon: <CardGiftcardIcon />,
    },
    {
      title: 'Cấp độ',
      icon: <AutoAwesomeMotionIcon />,
    },
    {
      title: 'Nhóm khách hàng',
      icon: <GroupsIcon />,
    },
    {
      title: 'Hình thức chăm sóc',
      icon: <CardGiftcardIcon />,
      to : '/customers/form-of-care'
    },
    {
      title: 'Lý do chăm sóc',
      icon: <CardGiftcardIcon />,
      to : '/customers/reason-for-care'

    },
  ],
};

export default customers;

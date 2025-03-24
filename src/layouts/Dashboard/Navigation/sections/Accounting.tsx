import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ListIcon from '@mui/icons-material/List';
import HistoryIcon from '@mui/icons-material/History';

import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import { ListItemMenuItem } from '../components/ListItemMenu';

const accountant: ListItemMenuItem = {
  title: 'Kế toán',
  children: [
    {
      title: 'Thu chi tiền mặt',
      icon: <LocalAtmIcon />,
      to: '/accounting/cash',
    },
    {
      title: 'Tổng hợp thu chi',
      icon: <BarChartIcon />,
      to: '/accounting/cashbook',
    },
    {
      title: 'Công nợ',
      icon: <PersonIcon />,
      children: [
        {
          title: 'Khách hàng',
          icon: <PersonIcon />,
          to: '/accounting/debt/customer',
        },
        {
          title: 'Nhà cung cấp',
          icon: <StoreIcon />,
          to: '/accounting/debt/supplier',
        },
        {
          title: 'Nhập công nợ đầu kỳ',
          icon: <AddIcon />,
        },
      ],
    },
    {
      title: 'Bút toán',
      icon: <FormatListBulletedIcon />,
      children: [
        {
          title: 'Bút toán',
          icon: <ListIcon />,
          to: '/accounting/transaction/index',
        },
        {
          title: 'Phát sinh đối ứng',
          icon: <FormatListBulletedIcon />,
        },
        {
          title: 'Nhật ký chung',
          icon: <FormatListBulletedIcon />,
        },
        {
          title: 'Thu hộ trả góp',
          icon: <FormatListBulletedIcon />,
        },
        {
          title: 'Lịch sử',
          icon: <HistoryIcon />,
          to: '/accounting/transaction/log',
        },
      ],
    },
    {
      title: 'Tài khoản kế toán',
      icon: <ContactPageIcon />,
      to: '/accounting/accounts',
    },
  ],
};

export default accountant;

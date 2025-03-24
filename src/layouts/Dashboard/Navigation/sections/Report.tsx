import CategoryIcon from '@mui/icons-material/Category';
import CopyrightIcon from '@mui/icons-material/Copyright';
// Icons
import HomeIcon from '@mui/icons-material/Home';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import PersonIcon from '@mui/icons-material/Person';
import type { ListItemMenuItem } from '../components/ListItemMenu';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

const Report: ListItemMenuItem = {
  title: 'Báo cáo',
  children: [
    {
      title: 'Doanh thu',
      icon: <LocalAtmIcon />,
      children: [
        {
          title: 'Theo cửa hàng',
          icon: <StoreOutlinedIcon />,
          to: '/report/revenue/depot',
        },
        {
          title: 'Theo nhân viên',
          icon: <PersonOutlineOutlinedIcon />,
          to: '/report/revenue/staff',
        },
        {
          title: 'Theo khách hàng',
          icon: <PersonOutlineOutlinedIcon />,
          to: '/report/revenue/customer',
        },
      ],
    },
    {
      title: 'Tồn kho',
      icon: <SwapHorizIcon />,
      children: [
        {
          title: 'Xuất nhập tồn theo sản phẩm',
          icon: <SignalCellularAltIcon />,
          to: '/report/inventory/index',
        },
      ],
    },
    {
      title: 'Sản phẩm',
      icon: <CopyrightIcon />,
      children: [
        {
          title: 'Bán chạy theo cửa hàng',
          icon: <StoreOutlinedIcon />,
          to: '/report/product/sellByStore',
        },
      ],
    },
    {
      title: 'Khách hàng',
      icon: <ListIcon />,
      children: [
        {
          title: 'Khách hàng mới',
          icon: <AddIcon />,
          to: '/report/customer/newCustomer',
        },
        {
          title: 'Theo sản phẩm',
          icon: <PersonIcon />,
          to: '/accounting/report/cash',
        },
      ],
    },
    {
      title: 'Kế toán',
      icon: <CalculateIcon />,
      children: [
        {
          title: 'Tổng hợp theo tài khoản',
          icon: <StoreOutlinedIcon />,
          to: '/report/accounting/account',
        },
        {
          title: 'Tổng hợp thu chi theo ngày',
          icon: <StoreOutlinedIcon />,
          to: '/accounting/report/daily',
        },

        {
          title: 'Báo cáo kết quả hoạt động kinh doanh',
          icon: <CalculateIcon />,
          to: '/report/accounting/businessresult',
        },
        {
          title: 'Bán chạy theo cửa hàng',
          icon: <StoreOutlinedIcon />,
          to: '/report/product/sellByStore',
        },
        {
          title: 'Bảng cân đối kế toán',
          icon: <StoreOutlinedIcon />,
          to: '/report/accounting/balancesheet',
        },
        {
          title: 'Tổng hợp thu chi theo cửa hàng',
          icon: <StoreOutlinedIcon />,
          to: '/report/accounting/store',
        },
      ],
    },
    {
      title: 'Zalo',
      icon: <HomeIcon />,
    },
  ],
};

export default Report;

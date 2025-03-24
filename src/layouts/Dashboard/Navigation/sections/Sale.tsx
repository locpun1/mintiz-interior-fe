import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import type { ListItemMenuItem } from '../components/ListItemMenu';
import HistoryIcon from '@mui/icons-material/History';
import WarehouseIcon from '@mui/icons-material/Warehouse';

const Sale: ListItemMenuItem = {
  title: 'Bán hàng',
  children: [
    {
      title: 'Bán hàng',
      icon: <WarehouseIcon />,
      to: '/sales/retail',
    },
    {
      title: 'Trả hàng',
      icon: <WarehouseIcon />,
      to: '/sales/return',
    },
    {
      title: 'Đơn vận chuyển',
      icon: <LocalShippingIcon />,
      to: '/sales/order-transport',
    },
    {
      title: 'Đơn hàng COD',
      icon: <LocalShippingIcon />,
      to: '/service/order-COD',
    },
    {
      title: 'Lịch sử vận đơn',
      icon: <HistoryIcon />,
      to: '/billion',
    },
  ],
};

export default Sale;

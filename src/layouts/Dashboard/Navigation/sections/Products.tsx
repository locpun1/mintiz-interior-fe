import type { ListItemMenuItem } from '../components/ListItemMenu';

// Icons
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import SettingsIcon from '@mui/icons-material/Settings';
import WarehouseIcon from '@mui/icons-material/Warehouse';
const products: ListItemMenuItem = {
  title: 'Sản phẩm',
  children: [
    {
      title: 'Sản phẩm',
      icon: <LocalMallIcon />,
      to: '/products',
    },
    {
      title: 'Tồn kho',
      icon: <WarehouseIcon />,
      to: '/products/inventory',
    },
    {
      title: 'Danh mục',
      icon: <CategoryIcon />,
      to: '/category',
    },
    {
      title: 'Nhà cung cấp',
      icon: <HomeIcon />,
      to: 'products/supplier',
    },
    {
      title: 'Thiết lập bảng giá',
      icon: <SettingsIcon />,
      to: '/products/setting-price-list',
    },
  ],
};

export default products;

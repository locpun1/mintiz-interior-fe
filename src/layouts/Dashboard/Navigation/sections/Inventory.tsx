import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import HistoryIcon from '@mui/icons-material/History';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import type { ListItemMenuItem } from '../components/ListItemMenu';

const Inventory: ListItemMenuItem = {
  title: 'Kho hàng',
  children: [
    {
      title: 'Xuất nhập kho',
      icon: <ImportExportIcon />,
      to: '/inventory',
    },
    {
      title: 'Chuyển kho',
      icon: <AutorenewIcon />,
      to: '/warehouse',
    },
    {
      title: 'Phiếu đặt hàng',
      icon: <LibraryBooksIcon />,
      to: '/inventory/order-slip',
    },
    {
      title: 'Kiểm kho',
      icon: <CheckBoxIcon />,
    },
    {
      title: 'Lịch sử sửa, xóa',
      icon: <HistoryIcon />,
      to: '/history',
    },
  ],
};

export default Inventory;

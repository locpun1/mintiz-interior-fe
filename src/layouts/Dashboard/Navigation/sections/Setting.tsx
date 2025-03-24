import type { ListItemMenuItem } from '../components/ListItemMenu';
import ListIcon from '@mui/icons-material/List';

const Setting: ListItemMenuItem = {
  title: 'Cài đặt',
  children: [
    {
      title: 'Cửa hàng',
      icon: <ListIcon />,
      to: '/setting/expire',
    },
  ],
};

export default Setting;

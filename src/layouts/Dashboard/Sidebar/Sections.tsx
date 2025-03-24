import { TFunction } from 'i18next';

import type { SvgIconComponent } from '@mui/icons-material';
import { HomeOutlined, PeopleOutline, PeopleOutlined } from '@mui/icons-material';

import { ROUTE_PATH } from '@/constants/routes';

export interface SectionItem {
  title: string;
  path: string;
  children?: SectionItem[];
  info?: () => JSX.Element;
  icon?: SvgIconComponent;
}

interface Section {
  section: string | null;
  items: SectionItem[];
}

const Sections = (t: TFunction): Section[] => {
  return AdminSections(t);
};
const AdminSections = (t: TFunction): Section[] => [
  {
    section: null,
    items: [
      {
        title: t('home'),
        path: ROUTE_PATH.HOME,
        icon: HomeOutlined,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('customer'),
        path: ROUTE_PATH.CUSTOMERS,
        icon: PeopleOutlined,
        children: [
          {
            title: t('customer'),
            icon: PeopleOutline,
            path: ROUTE_PATH.CUSTOMERS_LIST,
          },
        ],
      },
    ],
  },
];

export default Sections;

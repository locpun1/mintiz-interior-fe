import type { ColumnDef, Row } from '@tanstack/react-table';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';

import { getTranslation } from '@/utils/getTranslation';

const t = getTranslation('common');

interface SelectionProps<T> {
  isOpenExpander?: boolean;
}

const Selection = <T extends object>(props?: SelectionProps<T>) => {
  const { isOpenExpander = false } = props || {};
  const component: ColumnDef<T, any> = {
    id: 'selection',
    size: 40,
    maxSize: 40,
    minSize: 40,
    header: (info) => {
      return (
        <Checkbox
          checked={info.table.getIsAllRowsSelected()}
          indeterminate={info.table.getIsSomeRowsSelected()}
          onChange={info.table.getToggleAllRowsSelectedHandler()}
        />
      );
    },
    cell: ({ row }) =>
      row.getCanSelect() ? (
        <Box>
          <Checkbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={() => {
              row.toggleSelected();
              isOpenExpander && row.toggleExpanded();
            }}
          />
        </Box>
      ) : null,
    meta: {
      title: t('actions.select_all'),
      align: 'center',
    },
  };

  return component;
};

export default Selection;

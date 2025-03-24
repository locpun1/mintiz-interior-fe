import HeadInfo from './HeadInfo';
import type { Header } from '@tanstack/react-table';
import { SORT_DIRECTION } from '@/constants/common';
import TableSortLabel from '@mui/material/TableSortLabel';
import { flexRender } from '@tanstack/react-table';
import { Fragment } from 'react';

interface Props {
  header: Header<any, any>;
}

const HeaderSortLabel = (props: Props) => {
  const { header } = props;

  const canSort = header.column.getCanSort();
  const sorted = header.column.getIsSorted();
  const { info } = header.column.columnDef.meta || {};
  const content = header.isPlaceholder
    ? null
    : flexRender(header.column.columnDef.header, header.getContext());

  if (!canSort) {
    return (
      <Fragment>
        {content}
        <HeadInfo title={info} />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <TableSortLabel
        active={Boolean(sorted)}
        direction={sorted || SORT_DIRECTION.asc}
        onClick={header.column.getToggleSortingHandler()}
        hideSortIcon={!canSort}
      >
        {content}
      </TableSortLabel>
      <HeadInfo title={info} />
    </Fragment>
  );
};

export default HeaderSortLabel;

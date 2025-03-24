import { Row } from '@tanstack/react-table';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import ActionButton from '@/components/ProButton/ActionButton';
import ProTable, { Initialstate, ProTableProps } from '@/components/ProTable';
import { ProColumn } from '@/components/ProTable/types';
import { TableRef } from '@/components/ProTable/types/refs';

interface Props<T extends object> extends Omit<ProTableProps<T>, 'columns'> {
  fieldArrayName: string;
  columns: ProColumn<T>;
  addButtonText?: string;
  refetch?: () => void;
  data: T[];
  onAdd?: () => void;
  initialstate?: Initialstate<T>;
  toolBar?: React.ReactNode;
  filter?: React.ReactNode;
  onRowSelectionChange?: (rowIds: T[]) => void;
  getRowId?: (row: T, index: number) => string;
  enableRowSelection?: (row: Row<T>) => boolean;
  total?: React.ReactNode;
  title?: React.ReactNode;
}
const DynamicFormTable = forwardRef(
  <T extends object>(
    {
      fieldArrayName,
      columns,
      addButtonText,
      data,
      onAdd,
      refetch,
      initialstate,
      toolBar,
      filter,
      onRowSelectionChange,
      getRowId = (_, index) => index.toString(),
      total,
      title,
      ...props
    }: Props<T>,
    ref: React.ForwardedRef<TableRef>,
  ) => {
    const { t } = useTranslation('common', { keyPrefix: 'actions' });
    return (
      <ProTable<T>
        ref={ref}
        formName={fieldArrayName}
        initialstate={initialstate}
        columns={columns}
        data={data}
        enableEditing={true}
        refetch={refetch}
        onRowSelectionChange={onRowSelectionChange}
        getRowId={getRowId}
        filter={filter}
        {...props}
        toolBar={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {title}
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
              {toolBar}
              {onAdd && (
                <ActionButton onClick={onAdd} color='success' actionType='add'>
                  {addButtonText || t('add_new')}
                </ActionButton>
              )}
            </Box>
            {total}
          </Box>
        }
      />
    );
  },
);

export default DynamicFormTable;

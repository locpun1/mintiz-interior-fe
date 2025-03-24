import { ReactNode } from 'react';

import '@tanstack/react-table';

import type { CellContext, HeaderContext, Row, RowData } from '@tanstack/react-table';
import { Dayjs } from 'dayjs';

import type { TableCellProps } from '@mui/material/TableCell';
import { type FormAutoComplete } from '../core/EditableCell/ProFormAutocomplete';
import { type FormDateProps } from '../core/EditableCell/ProFormDate';
import { type FormSelectProps } from '../core/EditableCell/ProFormSelect';
import { type FormTextFieldProps } from '../core/EditableCell/ProFormTextField';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue = unknown> {
    title?: string;
    info?: string;
    align?: TableCellProps['align'];
    ellipsis?: boolean;
    type?: 'text' | 'date' | 'select' | 'img' | 'autocomplete';
    FormTextFieldProps?:
      | Partial<FormTextFieldProps>
      | ((row: TData, id: string, index: number) => Partial<FormTextFieldProps>);
    FormSelectProps?:
      | Partial<FormSelectProps<string | number>>
      | ((
          row: TData,
          id: string,
          index: number,
        ) => Partial<FormSelectProps<string | number | any>>);
    FormAutoComplete?:
      | Partial<FormAutoComplete<any, string | number>>
      | ((
          row: TData,
          id: string,
          index: number,
        ) => Partial<FormAutoComplete<any, string | number>>);
    FormDateProps?:
      | Partial<FormDateProps>
      | ((row: TData, id: string, index: number) => Partial<FormDateProps>);
    editable?: boolean | ((row: TData, context?: any) => boolean);
    rowSpan?: (context: CellContext<TData, any>, rows: Row<TData>[]) => number | null;
    colSpan?: (context: HeaderContext<TData, any>, rows: Row<TData>[]) => number | null;
    hidden?: boolean | ((row: TData) => boolean);
    required?: boolean;
    render?: (context: CellContext<TData, TValue>) => ReactNode;
  }

  interface TableMeta<TData extends RowData> {
    editableRows: Record<string, boolean>;
    toggleEditableRow: (rowId: string) => void;
    startRowEditMode: (rowId: string) => void;
    stopRowEditMode: (rowId: string) => void;
    getIsEdited: (rowId: string) => boolean;
    getIsSomeRowsEdited: () => boolean;
  }
}

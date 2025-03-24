import { type ColumnDef, type ColumnMeta, type Row } from '@tanstack/react-table';
import _ from 'lodash';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Checkbox, IconButton } from '@mui/material';
import { FormAutoComplete } from '../ProTable/core/EditableCell/ProFormAutocomplete';
import { FormDateProps } from '../ProTable/core/EditableCell/ProFormDate';
import { FormSelectProps } from '../ProTable/core/EditableCell/ProFormSelect';
import { FormTextFieldProps } from '../ProTable/core/EditableCell/ProFormTextField';
import { getColumnHelper } from '@/components/ProTable/utils/getColumnHelper';

import { PriceInput } from '@/plugins/NumberFormat';
import DateTime from '@/utils/DateTime';

export interface BaseRowData {
  id?: number;
  [key: string]: any;
}

export type ActionRowParams<T> = {
  row: Row<T>;
  setEditId: Dispatch<SetStateAction<number | null>>;
};

export type CreateActionRowParams<T> = Omit<ActionRowParams<T>, 'id'>;
interface UseBaseColumnsProps<T extends BaseRowData, TForm extends FieldValues> {
  onDelete?: ({ row, setEditId }: ActionRowParams<T>) => void;
  onUpdate?: ({ row, setEditId }: ActionRowParams<T>) => void;
  onCreate?: ({ row, setEditId }: CreateActionRowParams<T>) => void;
  key?: string;
  onCheckboxChange?: ({ row, setEditId }: CreateActionRowParams<T>) => void;
  onEdit?: ({ row, setEditId }: CreateActionRowParams<T>) => void;
  isHiddenEdit?: boolean;
  form?: UseFormReturn<TForm>;
}

export const useBaseColumns = <T extends BaseRowData, TForm extends FieldValues>({
  onDelete,
  onUpdate,
  onCreate,
  onEdit,
  key,
  onCheckboxChange,
  form,
  isHiddenEdit,
}: UseBaseColumnsProps<T, TForm> = {}) => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' });
  const [editId, setEditId] = useState<number | null>(null);
  const columnHelper = getColumnHelper<T>();

  const handleCancel = (row: Row<T>) => {
    form?.resetField(`${key}.${row.index}` as Path<TForm>, {
      defaultValue: row.original as PathValue<TForm, Path<TForm>>,
    });
    setEditId(null);
  };

  const handleEdit = (row: Row<T>) => {
    if (onEdit) {
      onEdit?.({ row, setEditId });
    } else {
      setEditId(row.original.id!);
    }
  };

  const renderActionButtons = useCallback(
    (row: Row<T>) => {
      const isEditing = row.original.id === editId;
      if (isHiddenEdit) {
        return (
          <IconButton
            title={t('delete')}
            size='small'
            onClick={() => onDelete?.({ row, setEditId })}
            color={'error'}
          >
            <DeleteIcon />
          </IconButton>
        );
      }

      return (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          {!row.original.id && onCreate && (
            <IconButton
              title={t('add')}
              size='small'
              onClick={() => onCreate({ row, setEditId })}
              color='primary'
            >
              <AddIcon />
            </IconButton>
          )}

          {row.original.id && (
            <IconButton
              title={isEditing ? t('save') : t('edit')}
              size='small'
              onClick={() => (isEditing ? onUpdate?.({ row, setEditId }) : handleEdit(row))}
              color='success'
            >
              {isEditing ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          )}

          {isEditing && (
            <IconButton
              title={t('reset')}
              size='small'
              onClick={() => handleCancel(row)}
              color={'inherit'}
            >
              <CloseIcon />
            </IconButton>
          )}

          {!isEditing && onDelete && (
            <IconButton
              title={t('delete')}
              size='small'
              onClick={() => onDelete({ row, setEditId })}
              color={'error'}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      );
    },
    [editId, onCreate, onDelete, onUpdate],
  );

  const createBaseTextColumn = (
    accessorKey: string,
    header: string,
    size: number = 200,
    type: 'text' | 'number' = 'text',
    props: {
      useIndexAsId?: boolean;
      textFieldProps?: (row: T, id: string, index: number) => Partial<FormTextFieldProps>;
      columnProps?: Partial<ColumnDef<T>>;
      editable?: boolean | ((row: T, context?: any) => boolean);
      maxSize?: number;
    } = {},
  ) => {
    const { textFieldProps, columnProps, useIndexAsId, editable, maxSize } = props;
    const getId = _.isUndefined(useIndexAsId) ? true : useIndexAsId;
    const slotProps = type === 'number' ? { input: { inputComponent: PriceInput } } : {};
    return columnHelper.accessor((row) => _.get(row, accessorKey), {
      id: accessorKey,
      size,
      maxSize,
      header: () => header,
      ...(!_.isUndefined(editable) &&
        !editable && {
          cell: (context) => {
            return context.getValue();
          },
        }),
      ...columnProps,
      meta: {
        title: header,
        type: 'text',
        editable: (row, context) =>
          typeof editable === 'function'
            ? editable(row, context)
            : editable || Number(row?.id) === editId || !row.id,
        FormTextFieldProps: (row, id, index) => {
          const props = textFieldProps?.(row, id, index);
          return {
            placeholder: header,
            name: key ? `${key}.${getId ? index : id}.${accessorKey}` : accessorKey,
            slotProps,
            ...props,
          };
        },
      },
    });
  };

  const createBaseSelectColumn = (
    accessorKey: string & keyof T,
    header: string,
    options: { value: string | number | boolean; label: string }[],
    size: number = 200,
    props: {
      useIndexAsId?: boolean;
      selectProps?: (row: T, id: string, index: number) => Partial<FormSelectProps>;
      columnProps?: Partial<ColumnDef<T>>;
      metaProps?: Partial<ColumnDef<T>>;
      maxSize?: number;
      editable?: boolean;
    } = { useIndexAsId: true },
  ) => {
    const { selectProps, columnProps, useIndexAsId, metaProps, maxSize, editable } = props;
    const getId = _.isUndefined(useIndexAsId) ? true : useIndexAsId;

    return columnHelper.accessor((row) => _.get(row, accessorKey), {
      id: accessorKey,
      size,
      maxSize,
      header: () => header,
      ...columnProps,
      meta: {
        title: header,
        type: 'select',
        editable: (row) => editable || Number(row?.id) === editId || !row.id,
        ...metaProps,
        FormSelectProps: (row, id, index) => ({
          options,
          placeholder: header,
          name: key ? `${key}.${getId ? index : id}.${accessorKey}` : accessorKey,
          ...selectProps?.(row, id, index),
        }),
      },
    });
  };

  const createBaseAutoCompleteColumn = (
    accessorKey: string & keyof T,
    header: string,
    size: number = 200,
    props: {
      useIndexAsId?: boolean;
      autoCompleteProps?:
        | Partial<FormAutoComplete<any, string | number>>
        | ((row: T, id: string, index: number) => Partial<FormAutoComplete<any, string | number>>);
      columnProps?: Partial<ColumnDef<T>>;
      metaProps?: Partial<ColumnDef<T>>;
    } = { useIndexAsId: true },
  ) => {
    const { autoCompleteProps, columnProps, useIndexAsId, metaProps } = props;
    const getId = _.isUndefined(useIndexAsId) ? true : useIndexAsId;
    const formAutoComplete = (row: T, id: string, index: number) =>
      _.isFunction(autoCompleteProps) ? autoCompleteProps(row, id, index) : autoCompleteProps;
    return columnHelper.accessor((row) => _.get(row, accessorKey), {
      id: accessorKey,
      size,
      header: () => header,
      ...columnProps,
      meta: {
        title: header,
        type: 'autocomplete',
        editable: (row) => Number(row?.id) === editId || !row.id,
        ...metaProps,
        FormAutoComplete: (row, id, index) => ({
          placeholder: header,
          name: key ? `${key}.${getId ? index : id}.${accessorKey}` : accessorKey,
          ...formAutoComplete(row, id, index),
        }),
      },
    });
  };

  const createCheckboxColumn = (
    accessorKey: string & keyof T,
    header: string,
    size: number = 100,
    props: {
      useIndexAsId?: boolean;
      columnProps?: Partial<ColumnDef<T>>;
      isDisable?: boolean;
      metaProps?: Partial<ColumnMeta<T>>;
    } = { useIndexAsId: true },
  ) => {
    const { columnProps, isDisable, metaProps } = props;
    return columnHelper.accessor((row) => _.get(row, accessorKey), {
      id: accessorKey,
      size,
      header: () => header,
      meta: {
        title: header,
        align: 'center',
        ...metaProps,
      },
      cell: (context) => {
        return (
          <Checkbox
            checked={Boolean(context.getValue())}
            onChange={() => onCheckboxChange?.({ row: context.row, setEditId })}
            disabled={isDisable}
            color='info'
            name={key ? `${key}.${context.row.index}.${accessorKey}` : accessorKey}
          />
        );
      },
      ...columnProps,
    });
  };

  const createBaseColumn = (
    accessorKey: string & keyof T,
    header: string,
    size: number = 200,
    props: {
      useIndexAsId?: boolean;
      columnProps?: Partial<ColumnDef<T>>;
      metaProps?: Partial<ColumnMeta<T>>;
    } = { useIndexAsId: true },
  ) => {
    const { columnProps, metaProps, useIndexAsId } = props;
    return columnHelper.accessor((row) => _.get(row, accessorKey), {
      id: accessorKey,
      size,
      header: () => header,
      ...columnProps,
      meta: {
        title: header,
        ...metaProps,
      },
    });
  };

  const createBaseDateColumn = (
    accessorKey: string & keyof T,
    header: string,
    size: number = 200,
    props: {
      useIndexAsId?: boolean;
      columnProps?: Partial<ColumnDef<T>>;
      metaProps?: Partial<ColumnDef<T>>;
      datePickerProps?: Partial<FormDateProps>;
      editable?: boolean;
    } = { useIndexAsId: true },
  ) => {
    const { columnProps, metaProps, datePickerProps, useIndexAsId, editable = true } = props;
    return columnHelper.accessor((row) => _.get(row, accessorKey), {
      id: accessorKey,
      size,
      header: () => header,
      ...(!_.isUndefined(editable) &&
        !editable && {
          cell: (context) => {
            return DateTime.Format(context.getValue() as string);
          },
        }),
      ...columnProps,
      meta: {
        title: header,
        type: 'date',
        editable: (row) => row.id === editId || !row.id,
        ...metaProps,
        FormDateProps: (_row, id, index) => ({
          placeholder: header,
          name: key ? `${key}.${useIndexAsId ? index : id}.${accessorKey}` : accessorKey,
          ...datePickerProps,
        }),
      },
    });
  };

  const actionColumn = {
    accessorKey: 'actions',
    id: 'actions',
    size: 55,
    enableSorting: false,
    header: () => t('action'),
    cell: (context) => renderActionButtons(context.row),
    meta: {
      title: t('action'),
      align: 'center',
    },
  } as ColumnDef<T, any>;

  return {
    createBaseTextColumn,
    createBaseSelectColumn,
    createCheckboxColumn,
    createBaseColumn,
    createBaseDateColumn,
    actionColumn,
    editId,
    setEditId,
    createBaseAutoCompleteColumn,
  };
};

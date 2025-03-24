import type { CellContext, ColumnMeta } from '@tanstack/react-table';
import get from 'lodash/get';
import { Fragment } from 'react';

import ProFormAutocomplete from './ProFormAutocomplete';
import ProFormDate from './ProFormDate';
import ProFormSelect from './ProFormSelect';
import ProFormTextField from './ProFormTextField';

interface Props<T> {
  context: CellContext<T, any>;
  enableEditing?: boolean;
  formName?: string;
}

const EditableCell = <T extends object>(props: Props<T>) => {
  const { context, enableEditing, formName } = props;
  const rowId = context.row.id;
  const columnId = context.column.id;
  const isEditing = context.table.options.meta?.getIsEdited(rowId);
  const {
    type,
    FormDateProps,
    FormSelectProps,
    FormTextFieldProps,
    FormAutoComplete,
    editable: updaterOrEdiable,
    render,
  } = get(context, ['column', 'columnDef', 'meta'], {} as ColumnMeta<T, any>);
  const name = `${formName}.${rowId}.${columnId}`;

  const editable =
    typeof updaterOrEdiable === 'function'
      ? updaterOrEdiable(context.row.original, context)
      : updaterOrEdiable;

  const formSelectProps =
    typeof FormSelectProps === 'function'
      ? FormSelectProps(context.row.original, rowId, context.row.index)
      : FormSelectProps;

  const formTextFieldProps =
    typeof FormTextFieldProps === 'function'
      ? FormTextFieldProps(context.row.original, rowId, context.row.index)
      : FormTextFieldProps;

  const formAutoComplete =
    typeof FormAutoComplete === 'function'
      ? FormAutoComplete(context.row.original, rowId, context.row.index)
      : FormAutoComplete || { options: [], placeholder: '' };

  if (render && !editable) {
    return render(context);
  }

  if ((enableEditing || isEditing) && editable) {
    switch (type) {
      case 'text':
        return <ProFormTextField name={name} {...formTextFieldProps} />;
      case 'select':
        return <ProFormSelect name={name} {...formSelectProps} />;
      case 'date':
        return <ProFormDate name={name} {...FormDateProps} />;
      case 'autocomplete':
        return <ProFormAutocomplete name={name} {...formAutoComplete} />;
      default:
        return null;
    }
  }

  if (render) {
    return render(context);
  }
  return <Fragment>{context.getValue()}</Fragment>;
};

export default EditableCell;

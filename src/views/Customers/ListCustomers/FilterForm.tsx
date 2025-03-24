import { forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Grid from '@mui/material/Grid2';
import { FilterValues } from './CustomerTable';
import FormFilterTable from '@/components/FormFilterTable';
import ProFormAutocomplete from '@/components/ProForm/Label/ProFormAutocomplete';
import ProFormHiddenInput from '@/components/ProForm/ProFormHiddenInput';

import { FilterState } from '@/hooks/useTableFilters';
import { FiltersRef } from '@/types/refs';

interface Props {
  onSubmit: (values: FilterValues) => void;
  onClear: () => void;
  showClearButton: boolean;
  filters: FilterState<FilterValues>;
}

const FiltersForm = forwardRef<FiltersRef, Props>((props, ref) => {
  const { onSubmit, onClear, showClearButton, filters } = props;
  const { t } = useTranslation('customer');

  const form = useForm<FilterValues>({
    defaultValues: {
      keyword: undefined,
      filter: {
        customerType: undefined,
        customerGroupId: undefined,
      },
    },
  });

  const handleSubmit = (values: FilterValues) => {
    const isEmptyFilter = Object.values(values.filter ?? {}).every((value) => value === undefined);
    if (values.keyword === '' && isEmptyFilter) {
      form.reset();
      onClear();
      return;
    }
    onSubmit(values);
  };
  const handleClear = () => {
    form.reset({
      filter: {
        customerType: undefined,
        customerGroupId: undefined,
        keyword: undefined,
      },
    });
    onClear();
  };

  return (
    <FormFilterTable
      searchProps={{
        placeholder: t('search'),
      }}
      form={form}
      onFinish={handleSubmit}
      filterActionProps={{
        onClear: handleClear,
        showClearButton: showClearButton,
      }}
    >
      <ProFormHiddenInput />
    </FormFilterTable>
  );
});

export default FiltersForm;

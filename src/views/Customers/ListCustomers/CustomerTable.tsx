import { useCallback, useEffect, useRef, useState } from 'react';

import CustomerActions from '../components/CustomerActions';
import FiltersForm from './FilterForm';
import useTableColumns from './TableColumns';
import ProTable from '@/components/ProTable';
import { TableRef } from '@/components/ProTable/types/refs';

import useRefresh from '@/hooks/useRefresh';
import useTableFilters, { FilterOperatorType } from '@/hooks/useTableFilters';
import { getCustomers } from '@/services/customer-service';
import { fetchCustomers, selectCustomers, setLoadingCustomer } from '@/slices/customer-slice';
import { useAppDispatch, useAppSelector } from '@/store';
import { Customer } from '@/types/customer-types';

export interface FilterValues {
  keyword?: string;
  filter?: { [key: string]: FilterOperatorType } | null;
}

const CustomerTable = () => {
  const tableRef = useRef<TableRef>(null);
  const [refresh, refetch] = useRefresh();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const dispatch = useAppDispatch();
  const { data, loading, total } = useAppSelector(selectCustomers);
  const { filters, isFilter, onSortingChange, onPageChange, onPageSizeChange, onFilter, onClear } =
    useTableFilters<FilterValues>();

  const fetchData = async () => {
    dispatch(setLoadingCustomer(true));
    try {
      const response = await getCustomers(filters);
      if (response.data) {
        dispatch(fetchCustomers(response.data));
      }
    } catch (error) {
      console.error('Failed to fetch customer groups', error);
    } finally {
      dispatch(setLoadingCustomer(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, refresh]);

  const handleDeleteSuccess = () => {
    refetch();
  };

  const handleResetFilters = () => {
    onClear();
    tableRef.current?.resetSorting();
  };

  const handleSubmitFilters = (values: FilterValues) => {
    if (values.filter) {
      onFilter({
        ...values,
        filter: Object.entries(values.filter).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: value === ('-10' as any) ? null : value,
          }),
          {},
        ),
      });
    }
  };

  const { columns } = useTableColumns(handleDeleteSuccess);

  return (
    <>
      <ProTable<Customer>
        loading={loading}
        columns={columns}
        ref={tableRef}
        data={data}
        onSortingChange={onSortingChange}
        pagination={{
          page: filters.page,
          limit: filters.limit,
          total,
          onPageChange,
          onPageSizeChange,
        }}
        getRowId={(row: Customer) => row.id.toString()}
        filter={
          <FiltersForm
            filters={filters}
            onSubmit={handleSubmitFilters}
            onClear={handleResetFilters}
            showClearButton={isFilter}
          />
        }
        onRowSelectionChange={(rowData) => {
          const rowIds = rowData.map((row) => row.id);
          setSelectedRows(rowIds);
        }}
        toolBar={
          <CustomerActions
            selectedRows={selectedRows}
            refetch={refetch}
            setSelected={setSelectedRows}
            tableRef={tableRef.current}
          />
        }
      />
    </>
  );
};

export default CustomerTable;

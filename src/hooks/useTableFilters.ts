import _ from 'lodash';
import { RefObject, useState } from 'react';

import type { ProTableSortingState } from '@/components/ProTable/types';
import { TableRef } from '@/components/ProTable/types/refs';

import { SORT_DIRECTION } from '@/constants/common';
import { FilterOperator, QueryPayloadType } from '@/types/common';

export type FilterOperatorType = {
  operator: FilterOperator;
  value: string;
};

export interface FilterParams<T> {
  keyword?: string | null;
  filter?: { [key: string]: FilterOperatorType | boolean } | null | boolean | any;
  year?: T | null;
  direction?: string;
  orderBy?: string;
  page?: number;
  limit?: number;
}

export type FilterState<T> = Omit<QueryPayloadType, 'totalPage' | 'total'> & FilterParams<T>;
type Props = {
  tableRef?: RefObject<TableRef>;
};

const useTableFilters = <T>({ tableRef }: Props = {}) => {
  const INIT_DATA = {
    page: 1,
    limit: 25,
    keyword: undefined,
  };
  const [filters, setFilters] = useState<FilterState<T>>(INIT_DATA);
  const [isFilter, setIsFilter] = useState(false);

  const onSortingChange = (sorting?: ProTableSortingState) => {
    if (!sorting || !sorting.length) {
      setFilters((state) => ({
        ...state,
        orderBy: undefined,
        direction: undefined,
      }));
      return;
    }
    const column = sorting[0];

    setIsFilter(true);
    setFilters((state) => ({
      ...state,
      orderBy: column.id,
      direction: column.desc ? SORT_DIRECTION.desc : SORT_DIRECTION.asc,
    }));
  };

  const onPageChange = (page: number) => {
    setFilters((state) => ({
      ...state,
      page,
    }));
  };

  const onPageSizeChange = (limit: number) => {
    setFilters((state) => ({
      ...state,
      limit: limit,
    }));
  };

  const onFilter = (filter?: FilterParams<T>) => {
    if (
      Object.values(filter?.filter ?? {}).every((value) => value === undefined) &&
      _.isUndefined(filter?.keyword)
    ) {
      setIsFilter(false);
      return;
    }

    const omitFilter = _.omitBy(
      filter,
      (value) => _.isNil(value) || (_.isObject(value) && _.isUndefined(value)),
    );
    if (_.has(omitFilter, 'keyword')) {
      _.set(omitFilter, 'keyword', _.trim(omitFilter['keyword'] as string));
    }

    const newState: FilterState<T> = {
      ...filters,
      ...(_.omitBy(omitFilter, _.isNil) as Omit<typeof omitFilter, 'filter'> & {
        filter?: { [key: string]: FilterOperatorType };
      }),
    };

    if (omitFilter?.filter) {
      const transformedFilter = onChangeFilter(omitFilter.filter);
      if (transformedFilter) {
        newState.filter = transformedFilter;
      }
    }

    setIsFilter(true);
    setFilters(newState);
  };

  const getOperatorByKey = (key: string): FilterOperator => {
    // if (key.endsWith('.from')) return FilterOperator.gte;
    // if (key.endsWith('.to')) return FilterOperator.lte;
    return FilterOperator.equals;
  };

  const onChangeFilter = (filters: Record<string, FilterOperatorType | any>) => {
    const transformedFilters: Record<string, FilterOperatorType | any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined) return;

      transformedFilters[key] = {
        operator: getOperatorByKey(key),
        value,
      };
    });

    return transformedFilters as any;
  };

  const onClear = () => {
    setIsFilter(false);
    setFilters(INIT_DATA);
    if (tableRef) {
      tableRef.current?.resetSorting();
      tableRef.current?.resetRowExpanded();
      tableRef.current?.resetRowSelection();
      tableRef.current?.resetEditableRow();
    }
  };

  return {
    filters,
    onSortingChange,
    onPageChange,
    onPageSizeChange,
    onFilter,
    isFilter,
    onClear,
    onChangeFilter,
  };
};

export default useTableFilters;

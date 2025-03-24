import type { SortDirection } from '@/types/common';

export const SORT_DIRECTION: Record<SortDirection, SortDirection> = {
  asc: 'asc',
  desc: 'desc',
};

export const DATA_PACKAGE_NO_LIMIT = -1;

export const DEBOUNCE_SEARCH_TIME = 300;

export const ALL = 'all';
export const FILTERS = 'filters';

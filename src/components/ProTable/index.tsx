import type {
  ColumnPinningState,
  ExpandedState,
  ExpandedStateList,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { isBoolean } from 'lodash';
import omit from 'lodash/omit';
import type { DispatchWithoutAction, ReactNode } from 'react';
import React, {
  ForwardedRef,
  forwardRef,
  Fragment,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { UseFormReturn } from 'react-hook-form';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Paper, { PaperProps } from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DENSITY } from './constants';
import EditableCell from './core/EditableCell';
import HeadActions from './core/HeadActions';
import HeaderSortLabel from './core/HeaderSortLabel';
import LoadingOverlay from './core/LoadingOverlay';
import Measurer from './core/Measurer';
import NoRowsOverlay from './core/NoRowsOverlay';
import ToggleFilter from './core/ToggleFilter';
import VisibilityColumns from './core/VisibilityColumns';
import ProTableCell from './ProTableCell';
import type { ProTablePaginationProps } from './ProTablePagination';
import ProTablePagination from './ProTablePagination';
import type { DensitySeverity, ProColumn } from './types';
import type { TableRef } from './types/refs';
import getRowSelections from './utils/getRowSelections';
import ProFormProvider from '@/components/ProForm/ProFormProvider';

import useScrollbar from '@/hooks/useScrollbar';
import TypedObject from '@/utils/TypedObject';

export interface Initialstate<T> {
  hiddenColumns?: (keyof T)[];
  hiddenColumnActions?: boolean;
  hiddenFilterActions?: boolean;
  hiddenVisibilityColumns?: boolean;
  hiddenFooter?: boolean;
  hiddenPagination?: boolean;
}

export interface ProTableProps<T> {
  pagination?: ProTablePaginationProps;
  data: T[];
  toolBar?: ReactNode;
  filter?: ReactNode;
  loading?: boolean;
  columns: ProColumn<T>;
  refetch?: DispatchWithoutAction;
  onSortingChange?: (sortingState: SortingState) => void;
  onRowSelectionChange?: (rowIds: T[]) => void;
  getRowSelection?: (rows: Row<T>[]) => void;
  onRowEditableChange?: (rowEditableState: Record<string, boolean>) => void;
  initialstate?: Initialstate<T>;
  expander?: (props: { row: Row<T>; onClose: () => void }) => ReactNode;
  getRowId?: (row: T, index: number) => string;
  getRowCanExpand?: (row: Row<T>) => boolean;
  editable?: boolean;
  form?: UseFormReturn<any, any>;
  size?: DensitySeverity;
  totalRow?: React.ReactElement;
  hiddenFooter?: boolean;
  enableEditing?: boolean;
  getSubRows?: (originalRow: T, index: number) => undefined | T[];
  formName?: string;
  PaperProps?: PaperProps;
  enableMultiRowSelection?: boolean;
  enableRowSelection?: boolean | ((row: Row<T>) => boolean);
}

const ProTable = <T extends object>(props: ProTableProps<T>, tableRef: ForwardedRef<TableRef>) => {
  const {
    toolBar,
    filter,
    data,
    pagination,
    loading,
    columns,
    onSortingChange,
    onRowSelectionChange,
    onRowEditableChange,
    getRowSelection,
    expander,
    getRowId,
    getRowCanExpand,
    editable,
    size,
    form,
    initialstate = {
      hiddenColumns: [],
      hiddenColumnActions: true,
      hiddenFilterActions: true,
      hiddenVisibilityColumns: false,
      hiddenFooter: false,
      hiddenPagination: false,
    },
    totalRow,
    hiddenFooter = true,
    enableEditing = false,
    getSubRows,
    formName = 'table',
    PaperProps,
    enableMultiRowSelection = true,
    enableRowSelection = true,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollbar = useScrollbar();
  const [stickyHeader] = useState<boolean>(true);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [density] = useState<DensitySeverity>(size || DENSITY.default);

  const [hiddenFilterActions] = useState<boolean>(() => {
    const { hiddenFilterActions } = initialstate;
    if (typeof hiddenFilterActions === 'boolean') {
      return hiddenFilterActions;
    }
    return true;
  });
  const [hiddenVisibilityColumns] = useState<boolean>(() => {
    const { hiddenVisibilityColumns } = initialstate;
    if (typeof hiddenVisibilityColumns === 'boolean') {
      return hiddenVisibilityColumns;
    }
    return true;
  });

  // Selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Visibility state
  const [columnVisibility, onColumnVisibilityChange] = useState<VisibilityState>(() => {
    const hiddenColumns = initialstate.hiddenColumns as string[];
    return hiddenColumns?.reduce<VisibilityState>((acc, column) => {
      acc[column] = false;
      return acc;
    }, {});
  });
  const [hiddenColumnActions] = useState<boolean>(() => {
    const { hiddenColumnActions } = initialstate;
    if (typeof hiddenColumnActions === 'boolean') {
      return hiddenColumnActions;
    }
    return true;
  });

  // Sorting state
  const [sorting, setSorting] = useState<SortingState>([]);

  // Pinning state
  const [columnPinning, onColumnPinningChange] = useState<ColumnPinningState>({
    left: [],
    right: [],
  });

  // Expanded state
  const [expanded, onExpandedChange] = useState<ExpandedState>({});

  // Editable state
  const [editableRows, setEditableRows] = useState<Record<string, boolean>>({});

  // Handle sorting
  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    new Promise<SortingState>((resolve) => {
      setSorting((state) => {
        const updatedState =
          typeof updaterOrValue === 'function' ? updaterOrValue(state) : updaterOrValue;
        resolve(updatedState);
        return updatedState;
      });
    }).then((state) => {
      if (state.length) {
        onSortingChange?.(state);
      }
    });
  };

  // Handle row selection
  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updaterOrValue) => {
    new Promise<RowSelectionState>((resolve) => {
      setRowSelection((state) => {
        const updatedState =
          typeof updaterOrValue === 'function' ? updaterOrValue(state) : updaterOrValue;
        resolve(updatedState);
        return updatedState;
      });
    }).then((state) => {
      onRowSelectionChange?.(getRowSelections(state, table.getRowModel().rowsById));
      getRowSelection?.(table.getSelectedRowModel().rows);
    });
  };

  // Handle edit mode
  const handleToggleEditableRow = (rowId: string) => {
    new Promise<Record<string, boolean>>((resolve) => {
      setEditableRows((state) => {
        if (rowId in editableRows) {
          const { [rowId]: removed, ...updatedState } = state;
          resolve(updatedState);
          return updatedState;
        } else {
          const updatedState = { ...state, [rowId]: true };
          resolve(updatedState);
          return updatedState;
        }
      });
    }).then((state) => {
      onRowEditableChange?.(state);
    });
  };

  const handleStartRowEditMode = (rowId: string) => {
    new Promise<Record<string, boolean>>((resolve) => {
      setEditableRows((state) => {
        const updatedState = { ...state, [rowId]: true };
        resolve(updatedState);
        return updatedState;
      });
    }).then((state) => {
      onRowEditableChange?.(state);
    });
  };

  const handleStopRowEditMode = (rowId: string) => {
    new Promise<Record<string, boolean>>((resolve) => {
      setEditableRows((state) => {
        const { [rowId]: removed, ...updatedState } = state;
        resolve(updatedState);
        return updatedState;
      });
    }).then((state) => {
      onRowEditableChange?.(state);
    });
  };

  const handleGetIsEdited = (rowId: string) => {
    return rowId in editableRows;
  };

  const getIsSomeRowsEdited = () => {
    return TypedObject.isExist(editableRows);
  };

  const hanleToggleAllRowExpand = () => {
    table.toggleAllRowsExpanded();
  };

  const table = useReactTable<T>({
    columns,
    data,
    state: {
      sorting,
      expanded,
      columnPinning,
      rowSelection,
      columnVisibility,
      pagination: pagination
        ? { pageIndex: pagination.page - 1, pageSize: pagination.limit }
        : undefined,
    },
    sortDescFirst: false,
    enableSortingRemoval: false,
    defaultColumn: {
      cell: (context) => (
        <EditableCell<T> context={context} enableEditing={enableEditing} formName={formName} />
      ),
    },
    manualPagination: true,
    enableMultiRowSelection,
    getRowId,
    onSortingChange: handleSortingChange,
    onRowSelectionChange: handleRowSelectionChange,
    onColumnVisibilityChange,
    onColumnPinningChange,
    onExpandedChange,
    getSubRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand,
    enablePinning: true,
    enableHiding: true,
    enableSorting: true,
    enableRowSelection,
    enableMultiSort: false,
    meta: {
      editableRows,
      toggleEditableRow: handleToggleEditableRow,
      startRowEditMode: handleStartRowEditMode,
      stopRowEditMode: handleStopRowEditMode,
      getIsEdited: handleGetIsEdited,
      getIsSomeRowsEdited: getIsSomeRowsEdited,
    },
  });

  const { getHeaderGroups, getRowModel, getFooterGroups, resetRowSelection, resetExpanded } = table;

  const handleExpandFilter = () => {
    setCollapsed(!collapsed);
  };
  const handleAddRowSelection = (index: number | string | number[]) => {
    new Promise<RowSelectionState>((resolve) => {
      setRowSelection((state) => {
        const updatedState = {
          ...state,
          ...(Array.isArray(index)
            ? index.reduce<Record<number, boolean>>((acc, item) => {
                acc[item] = true;
                return acc;
              }, {})
            : { [index]: true }),
        };
        resolve(updatedState);
        return updatedState;
      });
    }).then((state) => {
      table.setRowSelection(state);
      onRowSelectionChange?.(getRowSelections(state, table.getRowModel().rowsById));
    });
  };

  const handleToggleRowExpand = (ids: string[] | number[]) => {
    const mapIds = ids.reduce(
      (acc, id) => {
        acc[id] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    new Promise<ExpandedState>((resolve) => {
      onExpandedChange((state) => {
        const updatedState = isBoolean(state) ? state : { ...state, ...mapIds };
        resolve(updatedState);
        return updatedState;
      });
    }).then((state) => {});
  };

  const handleRemoveRowSelection = (rowId: string | string[]) => {
    const newRowSelection = omit(rowSelection, rowId);
    table.setRowSelection(newRowSelection);
    setRowSelection(newRowSelection);
  };

  const handleResetRowSelection = () => {
    resetRowSelection(true);
    setRowSelection({});
    onRowSelectionChange?.([]);
  };

  const handleResetRowExpanded = () => {
    resetExpanded(true);
  };

  const handleResetEditableRow = () => {
    setEditableRows({});
  };

  const handleResetSorting = () => {
    setSorting([]);
  };

  useImperativeHandle(tableRef, () => ({
    resetRowSelection: handleResetRowSelection,
    resetRowExpanded: handleResetRowExpanded,
    addRowSelection: handleAddRowSelection,
    removeRowSelection: handleRemoveRowSelection,
    toggleEditableRow: handleToggleEditableRow,
    startRowEditMode: handleStartRowEditMode,
    stopRowEditMode: handleStopRowEditMode,
    resetEditableRow: handleResetEditableRow,
    getIsSomeRowsEdited: getIsSomeRowsEdited,
    resetSorting: handleResetSorting,
    toggleRowExpand: handleToggleRowExpand,
    toggleAllRowExpand: hanleToggleAllRowExpand,
  }));
  return (
    <Paper
      elevation={12}
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
        height: 1,
      }}
      {...PaperProps}
    >
      <Collapse in={collapsed} timeout='auto'>
        {filter}
      </Collapse>
      <Box
        sx={{
          p: toolBar && hiddenFilterActions ? 1.5 : 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          width: '100%',
        }}
      >
        <Stack direction='row' spacing={1} width={'100%'}>
          {toolBar}
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        {(!hiddenVisibilityColumns || !hiddenFilterActions) && (
          <Stack direction='row' spacing={1}>
            {!hiddenVisibilityColumns && <VisibilityColumns table={table} />}
            {!hiddenFilterActions && (
              <ToggleFilter expanded={collapsed} onExpand={handleExpandFilter} />
            )}
          </Stack>
        )}
      </Box>
      <ProFormProvider form={form}>
        <TableContainer
          ref={containerRef}
          sx={{
            height: 1,
            width: 1,
            overflow: 'auto',
            position: 'relative',
            ...scrollbar,
          }}
        >
          <LoadingOverlay visible={loading} />
          <NoRowsOverlay visible={!loading && pagination?.total === 0} />
          <Table
            stickyHeader={stickyHeader}
            size={[DENSITY.default, DENSITY.dense].includes(density) ? 'small' : 'medium'}
            sx={{
              minWidth: 'max-content',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: 1,
              borderBottom: 0,
              borderColor: 'divider',
            }}
          >
            <TableHead>
              {getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const offset = header.getStart();
                    const width = header.getSize();
                    const maxWidth = header.column.columnDef.maxSize;
                    const minWidth = header.column.columnDef.minSize;
                    const align = header.column.columnDef.meta?.align;
                    return (
                      <ProTableCell
                        key={header.id}
                        header
                        colSpan={header.colSpan}
                        fixed={header.column.getIsPinned()}
                        align={align}
                        sortDirection={header.column.getIsSorted()}
                        sx={{ width, maxWidth, minWidth }}
                        offset={offset}
                      >
                        {!enableMultiRowSelection && header.id === 'selection' ? null : (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: align,
                              alignItems: 'center',
                              textTransform: 'uppercase',
                            }}
                          >
                            <HeaderSortLabel header={header} />
                            <HeadActions hidden={hiddenColumnActions} header={header} />
                          </Box>
                        )}
                      </ProTableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody sx={{ border: 1, borderColor: 'divider' }}>
              {getRowModel().rows.map((row) => {
                const selected = editable ? false : row.getIsSelected(); // Remove bground
                const expanded = row.getIsExpanded();

                return (
                  <Fragment key={row.id}>
                    <TableRow hover tabIndex={-1} selected={selected}>
                      {row.getVisibleCells().map((cell, index) => {
                        const offset = cell.column.getStart();
                        const fixed = cell.column.getIsPinned();
                        const align = cell.column.columnDef.meta?.align;
                        const rowSpan = cell.column.columnDef.meta?.rowSpan?.(
                          cell.getContext(),
                          getRowModel().rows,
                        );
                        const ellipsis = cell.column.columnDef.meta?.ellipsis;
                        if (rowSpan === null) {
                          return null;
                        }
                        return (
                          <ProTableCell
                            key={cell.id}
                            fixed={fixed}
                            align={align}
                            selected={selected}
                            offset={offset}
                            rowSpan={rowSpan}
                            sx={{
                              width: cell.column.getSize(),
                              ...(expanded &&
                                index === 0 && {
                                  '&:after': {
                                    position: 'absolute',
                                    content: '" "',
                                    top: 0,
                                    left: 0,
                                    backgroundColor: 'primary.main',
                                    width: 3,
                                    height: 'calc(100% + 1px)',
                                  },
                                }),
                            }}
                          >
                            {ellipsis ? (
                              <Box
                                className={'truncate'}
                                width={'100%'}
                                maxWidth={cell.column.getSize()}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </Box>
                            ) : (
                              flexRender(cell.column.columnDef.cell, cell.getContext())
                            )}
                          </ProTableCell>
                        );
                      })}
                    </TableRow>
                    {row.getCanExpand() && expanded && (
                      <TableRow
                        sx={{
                          backgroundColor: 'action.hover',
                          '& td': {
                            position: 'relative',
                          },
                        }}
                      >
                        <ProTableCell
                          sx={{
                            pl: 9,
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              left: 20,
                              top: '50%',
                              width: 16,
                              height: 2,
                              backgroundColor: 'primary.main',
                            },
                          }}
                          colSpan={row.getVisibleCells().length}
                          offset={0}
                        >
                          <Measurer element={containerRef}>
                            {expander?.({
                              row,
                              onClose: row.getToggleExpandedHandler(),
                            })}
                          </Measurer>
                        </ProTableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
              {totalRow}
            </TableBody>
            {!hiddenFooter && getRowModel().rows.length > 0 && (
              <TableFooter>
                {getFooterGroups().map((footerGroup) => {
                  return (
                    <TableRow key={footerGroup.id}>
                      {footerGroup.headers.map((header) => {
                        const align = header.column.columnDef.meta?.align;

                        const colSpan = header.column.columnDef.meta?.colSpan?.(
                          header.getContext(),
                          getRowModel().rows,
                        );
                        if (colSpan === null) {
                          return null;
                        }

                        return (
                          <ProTableCell key={header.id} offset={0} align={align} colSpan={colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.footer, header.getContext())}
                          </ProTableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      </ProFormProvider>
      {!initialstate.hiddenPagination && pagination && <ProTablePagination {...pagination} />}
    </Paper>
  );
};

export default forwardRef(ProTable);

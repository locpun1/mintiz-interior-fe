import { RowModel, RowSelectionState } from '@tanstack/react-table';

const getRowSelections = <T>(
  rowSelectionState: RowSelectionState,
  rowsById: RowModel<T>['rowsById']
): T[] => {
  return Object.keys(rowSelectionState)
    .filter((rowId) => rowSelectionState[rowId] && rowsById[rowId])
    .map((rowId) => rowsById[rowId].original);
};

export default getRowSelections;

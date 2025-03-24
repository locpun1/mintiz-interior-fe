export interface TableRef {
  resetRowSelection: () => void;
  resetRowExpanded: () => void;
  addRowSelection: (rowId: string | number | number[]) => void;
  removeRowSelection: (rowId: string | string[]) => void;
  toggleEditableRow: (rowId: string, remove?: boolean) => void;
  startRowEditMode: (rowId: string) => void;
  stopRowEditMode: (rowId: string) => void;
  resetEditableRow: () => void;
  getIsSomeRowsEdited: () => boolean;
  resetSorting: () => void;
  toggleRowExpand: (rowId: string[] | number[]) => void;
  toggleAllRowExpand: () => void;
}

export interface DialogRef {
  open: () => void;
  close: () => void;
}

export interface FiltersRef<> {
  reset: () => void;
  submit: () => void;
}

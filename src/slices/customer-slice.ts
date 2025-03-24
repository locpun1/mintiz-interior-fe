import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@/store';
import { Customer, CustomerContact, ListCustomerResponse } from '@/types/customer-types';

type RowsSelectedType = {
  id: string;
};
interface CustomerState {
  data: Customer[];
  loading: boolean;
  error: string | null;
  total: number;
  rowsSelected: RowsSelectedType[];
  customerContact: CustomerContact[];
}

const initialState: CustomerState = {
  data: [],
  loading: false,
  error: null,
  total: 0,
  rowsSelected: [],
  customerContact: [],
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setLoadingCustomer(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    fetchCustomers(state, action: PayloadAction<ListCustomerResponse>) {
      state.data = action.payload.items;
      state.total = action.payload.total;
    },
    fetchAllCustomer(state, action: PayloadAction<Customer[]>) {
      state.data = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setCustomersContact(state, action: PayloadAction<CustomerContact[]>) {
      state.customerContact = action.payload;
    },
  },
});

export const {
  setLoadingCustomer,
  fetchCustomers,
  fetchAllCustomer,
  setError,
  setCustomersContact,
} = customerSlice.actions;

export const selectCustomers = (state: RootState) => state.customer;

export default customerSlice.reducer;

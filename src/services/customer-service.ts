import axios from 'axios';

import { Endpoints } from '@/constants/endpoints';
import type { DeleteAllType, HttpResponse, QueryPayloadType } from '@/types/common';
import type {
  CreateCustomerAddressRequest,
  CreateCustomerContactRequest,
  CreateCustomerSchema,
  Customer,
  CustomerAddress,
  CustomerContact,
  ListCustomerAddressResponse,
  ListCustomerContactResponse,
  ListCustomerResponse,
  UpdateCustomerAddressRequest,
  UpdateCustomerContactRequest,
} from '@/types/customer-types';
import { PriceListCustomer } from '@/types/price-list-item-type';
import HttpClient from '@/utils/HttpClient';
import { prepareRealPath } from '@/utils/url';

export const getCustomers = (body: QueryPayloadType) => {
  return HttpClient.post<QueryPayloadType, HttpResponse<ListCustomerResponse>>(
    Endpoints.customer.search,
    body,
  );
};

export const getAllCustomer = () => {
  return HttpClient.get<null, HttpResponse<Customer[]>>(Endpoints.customer.create);
};

export const getCustomerById = (id: number) => {
  return HttpClient.get<null, HttpResponse<Customer>>(
    prepareRealPath(Endpoints.customer.detail, { id }),
  );
};

export const getCustomerPriceList = (id: number) => {
  return HttpClient.get<null, HttpResponse<PriceListCustomer>>(
    prepareRealPath(Endpoints.customer.customerPriceList, { id }),
  );
};

export const createCustomer = (data: CreateCustomerSchema) => {
  return HttpClient.post<any, HttpResponse<Customer>>(Endpoints.customer.create, data);
};

export const updateCustomer = (id: string, data: CreateCustomerSchema) => {
  return HttpClient.put<any, HttpResponse<CreateCustomerSchema>>(
    `${Endpoints.customer.create}/${id}`,
    data,
  );
};

export const deleteCustomer = (id: number) => {
  return HttpClient.delete(`${Endpoints.customer.create}/${id}`);
};

export const deleteManyCustomer = (ids: number[]) => {
  return HttpClient.post(`${Endpoints.customer.deleteMany}`, ids);
};

export const deleteCustomerAll = (params: DeleteAllType) => {
  return HttpClient.delete(`${Endpoints.customer.deleteAll}`, {
    params,
  });
};

export const importCustomer = (data: FormData) => {
  return HttpClient.post<any, HttpResponse<any>>(Endpoints.customer.import, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getCustomerAddressById = (id: string) => {
  return HttpClient.get<null, CustomerAddress[]>(`${Endpoints.customer.address}/${id}`);
};

export const getCustomerAddresses = (body: QueryPayloadType) => {
  return HttpClient.post<QueryPayloadType, HttpResponse<ListCustomerAddressResponse>>(
    Endpoints.customer.address_search,
    body,
  );
};

export const deleteCustomerAddress = (id: number) => {
  return HttpClient.delete(`${Endpoints.customer.address}/${id}`);
};

export const deleteCustomerFromCustomerGroup = (ids: string[]) => {
  return HttpClient.delete(`${Endpoints.customer.deleteCustomerFromCustomerGroup}`, {
    data: {
      ids,
    },
  });
};

export const updateCustomerToCustomerGroup = (id: string, ids: string[]) => {
  return HttpClient.put(`${Endpoints.customer.deleteCustomerFromCustomerGroup}/${id}`, {
    ids: ids,
  });
};

// Customer Contact
export const getContactByCustomerId = (id: string) => {
  return HttpClient.get<null, CustomerContact[]>(`${Endpoints.customer.contact}/customer/${id}`);
};

export const updateCustomerAddress = (id?: number, data?: UpdateCustomerAddressRequest) => {
  if (!id || !data) return;
  return HttpClient.put<any, HttpResponse<CustomerAddress>>(
    `${Endpoints.customer.address}/${id}`,
    data,
  );
};

export const updateCustomerContact = (id?: number, data?: UpdateCustomerContactRequest) => {
  if (!id || !data) return;
  return HttpClient.put<any, HttpResponse<CustomerContact>>(
    `${Endpoints.customer.contact}/${id}`,
    data,
  );
};

export const createCustomerContact = (data: CreateCustomerContactRequest) => {
  return HttpClient.post<any, HttpResponse<CustomerContact>>(Endpoints.customer.contact, data);
};

export const createCustomerAddress = (data: CreateCustomerAddressRequest) => {
  return HttpClient.post<any, HttpResponse<CustomerAddress>>(Endpoints.customer.address, data);
};

export const deleteCustomerContact = (id: number) => {
  return HttpClient.delete(`${Endpoints.customer.contact}/${id}`);
};

export const getCustomerContacts = (body: QueryPayloadType) => {
  return HttpClient.post<QueryPayloadType, HttpResponse<ListCustomerContactResponse>>(
    Endpoints.customer.contact_search,
    body,
  );
};

export const exportCustomers = (params: QueryPayloadType) => {
  return HttpClient.get('/customers/export', { params });
};

export const exportCustomerGroups = (params: QueryPayloadType) => {
  return HttpClient.get('/customer-groups/export', { params });
};

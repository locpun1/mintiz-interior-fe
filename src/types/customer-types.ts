import { CustomerGroupType } from './customer-group-types';
import { CustomerServiceType } from './customer-service-type';
import { Order } from './order';
import { TransactionType } from './transaction-type';
import { FileWithPreview } from '@/components/FileUpload';

export enum CustomerType {
  CUSTOMER = 'CUSTOMER',
  AGENCY = 'AGENCY',
}

export enum IdentityType {
  CCCD = 'CCCD',
  CMND = 'CMND',
  PASSPORT = 'PASSPORT',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
}

export enum ContactType {
  EMAIL = 'EMAIL',
  FACEBOOK = 'FACEBOOK',
  PHONE = 'PHONE',
  ZALO = 'ZALO',
  LINE = 'LINE',
  LINK = 'LINK',
  TIKTOK = 'TIKTOK',
}

export interface Customer {
  id: number;
  customerNumber: string;
  name: string;
  author: {
    username: string;
    id: number;
  };
  customerGroupId: number | null;
  customerType: CustomerType;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  customerAddresses: CustomerAddress[];
  order: Order[];
  customerServices: CustomerServiceType[];
  customerGroup: CustomerGroupType;
  transactions: TransactionType[];
  customerContacts: CustomerContact[];
  calculateAmountDue: number;
  code: string;
}

export type CreateCustomerSchema = {
  name: string;
  customerGroupId?: number;
  customerType: CustomerType;
  addresses?: CustomerAddress[];
  contacts?: CustomerContact[];
};

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  customerGroupId?: string;
}
export interface ListCustomerResponse {
  items: Customer[];
  total: number;
  page: number;
  limit: number;
}
export interface CustomerContact {
  id?: number;
  contactType: ContactType | string;
  value: string;
}

export interface CustomerAddress {
  id?: number;
  isDefault?: boolean;
  name?: string;
  postCode?: string;
  address?: string;
  country?: string;
  province?: string;
  district?: string;
  area?: string;
}

export interface ListCustomerAddressResponse {
  items: CustomerAddress[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateCustomerContactRequest {
  contactType: ContactType;
  value?: string;
  label?: string;
}

export interface UpdateCustomerAddressRequest {
  isDefault?: boolean;
  name?: string;
  postCode?: string;
  address?: string;
  country?: string;
  province?: string;
  district?: string;
  area?: string;
}

export interface CustomerIdentityType {
  id?: number;
  identityType: string;
  identityNumber: string;
  files?: FileWithPreview[];
}

export type CreateCustomerForm = CreateCustomerSchema & {
  identityFields?: CustomerIdentityType[];
  createdById?: string;
};
export type UpdateCustomerForm = {
  name: string;
  customerGroupId?: number;
  customerType: CustomerType;
};

export type CreateCustomerContactRequest = {
  contactType: ContactType;
  value: string;
  customerId: number;
};

export type CreateCustomerAddressRequest = {
  isDefault?: boolean;
  name?: string;
  postCode?: string;
  address?: string;
  country?: string;
  province?: string;
  district?: string;
  area?: string;
  customerId?: number;
};

export interface ListCustomerContactResponse {
  items: CustomerContact[];
}

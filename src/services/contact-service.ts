import { HttpResponse } from "@/types/common";
import { Contact } from "@/types/contact-types";
import HttpClient from "@/utils/HttpClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/contacts`;

interface ProfileDataRequest {
  name: string;
  email: string;
  phone: string;
  title: string;
  message: string;
  createdAt?:string;
  updatedAt?: string;
  isRead: number
}
interface GetContactsParams {
  limit: number;
  page: number;
  searchTerm?: string,
}

interface PaginatedResponse<T> {
  contacts?: T[]; // Dùng users hoặc tên phù hợp
  totalPages: number;
  currentPage: number;
  totalContact: number;
}

export type ContactsResponse = PaginatedResponse<Contact>;

export const sendInformation = (data: ProfileDataRequest) => {
    const endpoint = `${prefix}/send`;
    return HttpClient.post<any, HttpResponse<Contact>>(endpoint, data);
}

export const getContacts = (params: GetContactsParams) => {
  return HttpClient.get<any, HttpResponse<ContactsResponse>>(`${prefix}`, { params });
};

export const getContact = (id: string | number) => {
  return HttpClient.get<any, HttpResponse<ContactsResponse>>(`${prefix}/${id}`);
};
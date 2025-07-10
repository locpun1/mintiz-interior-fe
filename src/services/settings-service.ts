import { HttpResponse, PaginatedResponse } from "@/types/common";
import { IImageSlide, IServices } from "@/types/settings";
import HttpClient from "@/utils/HttpClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/settings`;

interface GetParams {
  size: number;
  page: number;
  searchTerm?: string,
}

export type SlidesResponse = PaginatedResponse<IImageSlide>;
export type ServicessResponse = PaginatedResponse<IServices>;

export const getSlides = (params: GetParams) => {
    return HttpClient.get<any, HttpResponse<SlidesResponse>>(`${prefix}/image-slides`, { params})
}

export const uploadImageSlide = (FormData: FormData) => {
  const endpoint = `${prefix}/upload-image`;
  return HttpClient.post<FormData, HttpResponse<IImageSlide>>(endpoint, FormData);
}

export const deleteImageSlide = (id: string | number) => {
  return HttpClient.delete<any,HttpResponse<IImageSlide>>(`${prefix}/delete-image/${id}`);
}

export const createServices = (FormData: FormData) => {
  const endpoint = `${prefix}/create-service`;
  return HttpClient.post<FormData, HttpResponse<IServices>>(endpoint,FormData)
}

export const getServices = (params: GetParams) => {
    return HttpClient.get<any, HttpResponse<ServicessResponse>>(`${prefix}/services`, { params})
}

export const deleteService = (id: string | number) => {
  return HttpClient.delete<any, HttpResponse<IServices>>(`${prefix}/delete-service/${id}`)
}

export const getService = (id: string | number) => {
  return HttpClient.get<any, HttpResponse<IServices>>(`${prefix}/service/${id}`)
}

export const updateServices = (id: string | number, formData: FormData) => {
  const endpoint = `${prefix}/update-service/${id}`;
  return HttpClient.put<FormData, HttpResponse<IServices>>(endpoint, formData)
}
import { HttpResponse } from "@/types/common";
import { GroupPermission, IMenu } from "@/types/permission";
import HttpClient from "@/utils/HttpClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/permission`;

interface GroupPermissionResquest{
  name: string,
  permission: IMenu[]
}

interface GroupPermissionRes{
  id: number,
  name: string
}

interface UserPermissionRequest{
  userId: number | string,
  roleGroupId: number
}

export const getAllModules = () => {
  return HttpClient.get<any, HttpResponse<IMenu>>(`${prefix}/menu-with-action`);
};

export const createRoleGroup = (data: GroupPermissionResquest) => {
  const endpoint = `${prefix}/create-permission-group`;
  return HttpClient.post<any, HttpResponse<GroupPermissionRes>>(endpoint,data)
}

export const getAllRoleGroups = () => {
  return HttpClient.get<any, HttpResponse<GroupPermission>>(`${prefix}/list-role-groups`);
}

export const assignedGroupToUser = (data: UserPermissionRequest) => {
  const endpoint = `${prefix}/assign-group-to-user`;
  return HttpClient.post<any, HttpResponse>(endpoint, data)
}

export const getRoleGroupToUser = (id: string | number) => {
  return HttpClient.get<any, HttpResponse<GroupPermission>>(`${prefix}/get-assigned-group-to-user/${id}`)
}
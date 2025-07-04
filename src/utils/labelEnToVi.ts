import { ROLE_LABELS, RoleUser } from "@/constants/status";

export const getRoleLabel = (role: RoleUser | null | undefined): string => {
    if(!role) return "Chưa xác định";
    return ROLE_LABELS[role] || role
}
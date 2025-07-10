import { ROLE_LABELS, RoleUser } from "@/constants/status";

export const getRoleLabel = (role: RoleUser | null | undefined): string => {
    if(!role) return "Chưa xác định";
    return ROLE_LABELS[role] || role
}

export const getFormatText = (content: string): string => {
    const formatText = content
        .replace(/<p>/g, '')         // bỏ <p>
        .replace(/<\/p>/g, '\n\n')    // đổi </p> thành xuống 2 dòng
        .replace(/<[^>]+>/g, '');     // remove tất cả tag html còn lại
    return formatText;
}
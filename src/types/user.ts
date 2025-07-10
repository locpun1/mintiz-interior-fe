// src/types/user.ts
export interface IUser {
    id: number;
    username: string;
    fullName: string;
    role: 'admin' | 'employee';
    createdAt: string;
    updatedAt: string;
    email?: string,
    address?: string,
    phone_number?: string,
    captchaCode?:string,
    avatar_url?:string,
    is_deleted?: number;
    is_default?: number;
}


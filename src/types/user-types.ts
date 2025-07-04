export interface UserProfile{
    id: string | number,
    username: string,
    fullName: string;
    role: string,
    createdAt?: string,
    updatedAt?: string,
    email?: string,
    address?: string,
    phone_number?: string,
    password?:string,
    captchaCode?:string,
    avatar_url?:string,
    is_deleted?: number;
    is_default?: number;
}
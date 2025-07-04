// src/types/user.ts
export interface IUser {
    id: number;
    username: string;
    fullName: string;
    role: 'admin' | 'employee';
    phone?: string | null;
    avatarUrl?: string | null;
    createdAt: string;
    updatedAt: string;
}

// src/types/post.ts
import { IUser } from './user';

export interface IPost {
  id: number;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string | null;
  category: string;
  author: IUser;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  isPublished :boolean;
}
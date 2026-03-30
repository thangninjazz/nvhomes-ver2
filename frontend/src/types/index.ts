// Khai báo các Type (Kiểu dữ liệu) để sử dụng chung trên ứng dụng Frontend

export enum UserRole {
  Admin = 'Admin',
  Sales = 'Sales',
  Editor = 'Editor'
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  address?: string;
  needs?: string;
  status: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  categoryId: string;
  categoryName: string;
  images?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  tags?: string;
  images?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  authorName: string;
  createdAt: string;
}

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: string; // should be 'ADMIN'
  // any other fields from backend response
}
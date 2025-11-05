
import { Address } from "./subscription";
export class User {
  id!: string;
  email!: string;
  name!: string;
  phone!: number;
  token!: string;
  isAdmin!: boolean;
  isBlocked!: boolean;
  role!: string; // ← ADD THIS
  addresses?: Address[];
}
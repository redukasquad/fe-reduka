import type { User } from "../entites/user";

export interface AuthState {
  user: User | null;
  token: string | null;
}
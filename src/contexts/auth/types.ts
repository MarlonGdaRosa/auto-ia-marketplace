
import { Session } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  name: string;
  cpf?: string;
  phone?: string;
  role: "user" | "admin";
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    cpf: string;
    phone: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

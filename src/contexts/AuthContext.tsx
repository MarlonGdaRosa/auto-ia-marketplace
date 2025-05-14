
// This file directly exports the useAuth hook to avoid circular dependencies
import { useAuth, AuthProvider } from './auth/AuthProvider';
export { useAuth, AuthProvider };
export type { User, AuthContextType } from './auth/types';


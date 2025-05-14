
// Export the AuthProvider and types directly (not the useAuth hook which creates circular dependency)
export { AuthProvider } from './AuthProvider';
export type { User, AuthContextType } from './types';


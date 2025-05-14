
// Export the AuthProvider and useAuth hook
import { AuthProvider } from './AuthProvider';
import type { User, AuthContextType } from './types';

// Re-export everything
export { AuthProvider };
export type { User, AuthContextType };

// Export useAuth separately to avoid circular references
export { useAuth } from './useAuth';

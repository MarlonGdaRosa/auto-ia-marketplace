
// Export types and components directly
import { AuthProvider } from './AuthProvider';
import { User, AuthContextType } from './types';

// Export the hook from the provider file
import { useAuth } from './AuthProvider';

export { AuthProvider, useAuth };
export type { User, AuthContextType };

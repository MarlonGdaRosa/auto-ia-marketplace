import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface User {
  id: string;
  email: string;
  name: string;
  cpf?: string;
  phone?: string;
  role: "user" | "admin";
}

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state and listen for changes
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        // If session exists, fetch the user profile
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        } else {
          setIsLoading(false);
        }
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log("Auth state change:", event);
            setSession(newSession);
            
            if (event === 'SIGNED_IN' && newSession) {
              // Use timeout to avoid potential deadlocks
              setTimeout(() => {
                fetchUserProfile(newSession.user.id);
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              // Fix: Using 'SIGNED_OUT' instead of 'USER_DELETED'
              setUser(null);
              setIsLoading(false);
              // Redirect to home page or login page when signed out
              navigate("/");
            }
          }
        );
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, [navigate]);
  
  // Fetch user profile helper function
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (profile) {
        setUser({
          id: userId,
          email: profile.email || '',
          name: profile.name,
          cpf: profile.cpf || undefined,
          phone: profile.phone || undefined,
          role: profile.role as "user" | "admin"
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Erro ao carregar perfil do usuário");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Sign out from any existing session
      await supabase.auth.signOut({ scope: 'global' });
      
      // Sign in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Login realizado com sucesso!");
      
      // Session will be updated through the onAuthStateChange listener
      // which will also fetch the profile and set the user state
      
      // Redirect based on user role
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        if (profile?.role === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Erro ao realizar login");
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    cpf: string;
    phone: string;
  }) => {
    try {
      setIsLoading(true);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Update the profile with additional information
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: userData.name,
            cpf: userData.cpf,
            phone: userData.phone
          })
          .eq('id', data.user.id);
          
        if (profileError) {
          console.error("Error updating profile:", profileError);
          toast.error("Cadastro realizado, mas houve erro ao atualizar o perfil");
        } else {
          toast.success("Cadastro realizado com sucesso!");
        }
      }
      
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Erro ao realizar cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clean up auth state before logout
      cleanupAuthState();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      setUser(null);
      setSession(null);
      
      toast.success("Logout realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Erro ao realizar logout");
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.role === "admin";

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    login,
    register,
    logout
  };

  // Show loading state while initializing auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

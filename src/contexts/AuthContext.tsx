
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  logout: () => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check for session with Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile from database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile.name,
              cpf: profile.cpf || undefined,
              phone: profile.phone || undefined,
              role: profile.role as "user" | "admin"
            });
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Get user profile when auth state changes
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile.name,
              cpf: profile.cpf || undefined,
              phone: profile.phone || undefined,
              role: profile.role as "user" | "admin"
            });
          }
        } else {
          setUser(null);
        }
      }
    );

    checkUser();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Login realizado com sucesso!");
      
      // Redirect based on user role
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
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Erro ao realizar login");
    } finally {
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
        }
      }
      
      toast.success("Cadastro realizado com sucesso!");
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
      await supabase.auth.signOut();
      setUser(null);
      toast.success("Logout realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erro ao realizar logout");
    }
  };

  const isAdmin = user?.role === "admin";

  const value = {
    user,
    isLoading,
    isAdmin,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

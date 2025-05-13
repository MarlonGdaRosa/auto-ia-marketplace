
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";

export const login = async (
  email: string, 
  password: string, 
  navigate: NavigateFunction,
  setIsLoading: (isLoading: boolean) => void
) => {
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

export const register = async (
  userData: {
    email: string;
    password: string;
    name: string;
    cpf: string;
    phone: string;
  },
  navigate: NavigateFunction,
  setIsLoading: (isLoading: boolean) => void
) => {
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

export const logout = async (
  navigate: NavigateFunction,
  setUser: (user: null) => void,
  setSession: (session: null) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
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

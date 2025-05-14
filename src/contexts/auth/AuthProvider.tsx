
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { fetchUserProfile } from "./userProfile";
import { login, logout, register } from "./authMethods";
import { User, AuthContextType } from "./types";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Avoid duplicate initialization
    if (authInitialized) return;
    
    const initializeAuth = async () => {
      try {
        console.log("Inicializando autenticação...");
        
        // Set up auth state listener first to avoid missing events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log("Auth state change:", event);
            setSession(newSession);
            
            if (event === 'SIGNED_IN' && newSession) {
              // Use setTimeout to avoid potential deadlocks
              setTimeout(() => {
                console.log("Buscando perfil do usuário após SIGNED_IN");
                fetchUserProfile(newSession.user.id).then(profile => {
                  if (profile) {
                    setUser(profile);
                  }
                  setIsLoading(false);
                });
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              console.log("Usuário desconectado, limpando estado");
              setUser(null);
              setIsLoading(false);
            }
          }
        );
        
        // AFTER that check if there is an existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Sessão atual:", currentSession ? "existe" : "não existe");
        setSession(currentSession);
        
        // If session exists, fetch user profile
        if (currentSession?.user) {
          try {
            console.log("Buscando perfil do usuário na inicialização");
            const profile = await fetchUserProfile(currentSession.user.id);
            if (profile) {
              console.log("Perfil encontrado:", profile.role);
              setUser(profile);
            }
          } catch (profileError) {
            console.error("Erro ao buscar perfil:", profileError);
          }
        }
        
        setIsLoading(false);
        setAuthInitialized(true);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };
    
    initializeAuth();
  }, [navigate, authInitialized]);

  const handleLogin = async (email: string, password: string) => {
    return login(email, password, navigate, setIsLoading);
  };

  const handleRegister = async (userData: {
    email: string;
    password: string;
    name: string;
    cpf: string;
    phone: string;
  }) => {
    return register(userData, navigate, setIsLoading);
  };

  const handleLogout = async () => {
    return logout(navigate, setUser, setSession, setIsLoading);
  };

  const isAdmin = user?.role === "admin";

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
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

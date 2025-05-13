
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { fetchUserProfile } from "./userProfile";
import { login, logout, register } from "./authMethods";
import { User, AuthContextType } from "./types";

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
          const profile = await fetchUserProfile(currentSession.user.id);
          if (profile) {
            setUser(profile);
          }
        }
        
        setIsLoading(false);
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log("Auth state change:", event);
            setSession(newSession);
            
            if (event === 'SIGNED_IN' && newSession) {
              // Use timeout to avoid potential deadlocks
              setTimeout(() => {
                fetchUserProfile(newSession.user.id).then(profile => {
                  if (profile) {
                    setUser(profile);
                  }
                  setIsLoading(false);
                });
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

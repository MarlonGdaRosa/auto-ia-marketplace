
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
        // Simulate checking session with stored user data
        const storedUser = localStorage.getItem("automarket_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate login - In a real app, this would be an API call to Supabase
      // This is just for demonstration purposes
      if (email === "admin@example.com" && password === "password") {
        const userData: User = {
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin"
        };
        setUser(userData);
        localStorage.setItem("automarket_user", JSON.stringify(userData));
        toast.success("Login realizado com sucesso!");
        navigate("/admin/dashboard");
      } else if (email && password) {
        // Simulate a regular user login
        const userData: User = {
          id: "2",
          email,
          name: "Cliente",
          role: "user"
        };
        setUser(userData);
        localStorage.setItem("automarket_user", JSON.stringify(userData));
        toast.success("Login realizado com sucesso!");
        navigate("/");
      } else {
        toast.error("Email ou senha inválidos");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro ao realizar login");
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
      
      // Simulate registration
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.name,
        cpf: userData.cpf,
        phone: userData.phone,
        role: "user"
      };
      
      setUser(newUser);
      localStorage.setItem("automarket_user", JSON.stringify(newUser));
      toast.success("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Erro ao realizar cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("automarket_user");
    toast.success("Logout realizado com sucesso!");
    navigate("/");
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

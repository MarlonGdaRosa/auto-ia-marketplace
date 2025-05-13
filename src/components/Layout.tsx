
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, UserCircle2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Car className="h-6 w-6 mr-2 text-brand-blue" />
            <span className="font-bold text-xl">AutoMarket</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                {/* Only show "Anunciar veículo" button for logged in users */}
                <Button 
                  variant="outline" 
                  className="hidden sm:flex items-center gap-1"
                  onClick={() => navigate("/admin/vehicles/new")}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Anunciar veículo
                </Button>
                <Button 
                  variant="default" 
                  className="flex items-center gap-1"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  <UserCircle2 className="h-4 w-4 mr-1" />
                  Painel
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                className="flex items-center gap-1"
                onClick={() => navigate("/admin")}
              >
                <UserCircle2 className="h-4 w-4 mr-1" />
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 text-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Car className="h-6 w-6 mr-2 text-brand-blue" />
              <span className="font-bold text-xl">AutoMarket</span>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} AutoMarket. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

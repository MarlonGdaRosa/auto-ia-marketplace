
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, UserCircle2, PlusCircle, Download, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isPWAInstallable, setIsPWAInstallable] = useState(false);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Handle PWA installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsPWAInstallable(true);
      
      // Show the install prompt for mobile devices
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        setShowPWAPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = () => {
    setShowPWAPrompt(false);
    
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        // Clear the saved prompt as it can't be used again
        setDeferredPrompt(null);
        setIsPWAInstallable(false);
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* PWA Installation Dialog */}
      <AlertDialog open={showPWAPrompt} onOpenChange={setShowPWAPrompt}>
        <AlertDialogContent className="max-w-[350px] rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Instalar Aplicativo</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja instalar o AutoMarket em seu dispositivo para acesso rápido e uso offline?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Agora não</AlertDialogCancel>
            <AlertDialogAction onClick={handleInstallPWA} className="bg-brand-blue">
              <Download className="mr-2 h-4 w-4" />
              Instalar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Car className="h-6 w-6 mr-2 text-brand-blue" />
            <span className="font-bold text-xl">AutoMarket</span>
          </Link>
          
          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <Link to="/" className="flex items-center">
                      <Car className="h-6 w-6 mr-2 text-brand-blue" />
                      <span className="font-bold text-xl">AutoMarket</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {user ? (
                      <>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            navigate("/admin/vehicles/new");
                            setOpen(false);
                          }}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Anunciar veículo
                        </Button>
                        <Button 
                          variant="default" 
                          className="w-full justify-start"
                          onClick={() => {
                            navigate("/admin/dashboard");
                            setOpen(false);
                          }}
                        >
                          <UserCircle2 className="h-4 w-4 mr-2" />
                          Painel
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="default" 
                        className="w-full justify-start"
                        onClick={() => {
                          navigate("/admin");
                          setOpen(false);
                        }}
                      >
                        <UserCircle2 className="h-4 w-4 mr-2" />
                        Entrar
                      </Button>
                    )}
                    
                    {isPWAInstallable && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={handleInstallPWA}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Instalar app
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
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
            
            {isPWAInstallable && (
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleInstallPWA}
              >
                <Download className="h-4 w-4 mr-1" />
                Instalar
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

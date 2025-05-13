
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { 
  Car, 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin/dashboard",
    },
    {
      label: "Veículos",
      icon: <Car className="h-5 w-5" />,
      href: "/admin/vehicles",
    },
    {
      label: "Vendedores",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/sellers",
    },
    {
      label: "Propostas",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/admin/proposals",
    },
  ];

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-2 p-2 rounded-md transition-colors",
          isActive 
            ? "bg-brand-blue text-white" 
            : "hover:bg-gray-200 text-gray-700"
        )}
        onClick={() => setOpen(false)}
      >
        {item.icon}
        {item.label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile header */}
      <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between md:hidden">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-brand-blue" />
          <span className="font-heading font-bold text-xl">AutoMarket</span>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <Link to="/admin/dashboard" className="flex items-center gap-2">
                    <Car className="h-6 w-6 text-brand-blue" />
                    <span className="font-heading font-bold text-xl">Admin</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink key={item.href} item={item} />
                ))}
              </div>
              <div className="p-4 border-t">
                <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-64 border-r bg-white p-4">
          <div className="flex items-center gap-2 mb-6">
            <Car className="h-6 w-6 text-brand-blue" />
            <span className="font-heading font-bold text-xl">Admin</span>
          </div>
          <Separator className="mb-4" />
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
          <div className="mt-auto pt-6">
            <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

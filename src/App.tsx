
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import VehicleDetails from "./pages/VehicleDetails";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminVehicles from "./pages/admin/Vehicles";
import AdminVehicleForm from "./pages/admin/VehicleForm";
import AdminSellers from "./pages/admin/Sellers";
import AdminProposals from "./pages/admin/Proposals";

// Auth provider
import { AuthProvider } from "./contexts/AuthContext";
import RouteGuard from "./components/RouteGuard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner closeButton position="top-right" />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<RouteGuard><AdminDashboard /></RouteGuard>} />
            <Route path="/admin/vehicles" element={<RouteGuard><AdminVehicles /></RouteGuard>} />
            <Route path="/admin/vehicles/new" element={<RouteGuard><AdminVehicleForm /></RouteGuard>} />
            <Route path="/admin/vehicles/edit/:id" element={<RouteGuard><AdminVehicleForm /></RouteGuard>} />
            <Route path="/admin/sellers" element={<RouteGuard><AdminSellers /></RouteGuard>} />
            <Route path="/admin/proposals" element={<RouteGuard><AdminProposals /></RouteGuard>} />
            
            {/* Not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

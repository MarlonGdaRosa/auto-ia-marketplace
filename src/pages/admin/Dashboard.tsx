
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Car,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  Loader2
} from "lucide-react";
import { getDashboardStats } from "@/services/supabaseService";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats
  });

  const cardStyle = {
    container: "bg-white shadow-sm rounded-xl overflow-hidden",
    header: "py-3 px-5 bg-gray-50 border-b",
    title: "text-sm font-medium text-gray-500",
    content: "p-5 flex items-center",
    icon: "h-12 w-12 p-2.5 rounded-full mr-4",
    value: "text-3xl font-bold",
    label: "text-gray-500 text-sm mt-1",
  };

  if (!user) {
    return null; // Will be redirected by useEffect
  }

  return (
    <AdminLayout title="Dashboard">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-brand-blue animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total de Veículos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="bg-blue-50 text-blue-500 rounded-full p-3 mr-4">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats?.totalVehicles || 0}</div>
                  <div className="text-gray-500 text-sm">veículos cadastrados</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Veículos Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="bg-green-50 text-green-500 rounded-full p-3 mr-4">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats?.totalSold || 0}</div>
                  <div className="text-gray-500 text-sm">vendas realizadas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Marca mais popular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="bg-purple-50 text-purple-500 rounded-full p-3 mr-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats?.topBrand.name || "N/A"}</div>
                  <div className="text-gray-500 text-sm">{stats?.topBrand.count || 0} veículos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Novas Propostas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="bg-amber-50 text-amber-500 rounded-full p-3 mr-4">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats?.newProposals || 0}</div>
                  <div className="text-gray-500 text-sm">propostas não lidas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
};

export default Dashboard;

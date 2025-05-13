
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { dashboardStats, vehicles, sellers, proposals } from "@/services/mockData";
import { formatCurrency } from "@/lib/format";
import {
  Car,
  Users,
  MessageSquare,
  TrendingUp,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard: React.FC = () => {
  // Group vehicles by brand for chart
  const brandCounts = vehicles.reduce<Record<string, number>>((acc, vehicle) => {
    acc[vehicle.brand] = (acc[vehicle.brand] || 0) + 1;
    return acc;
  }, {});

  const brandData = Object.keys(brandCounts).map((brand) => ({
    name: brand,
    value: brandCounts[brand],
  }));

  // Calculate average price by brand
  const avgPriceByBrand = vehicles.reduce<Record<string, { total: number; count: number }>>(
    (acc, vehicle) => {
      if (!acc[vehicle.brand]) {
        acc[vehicle.brand] = { total: 0, count: 0 };
      }
      acc[vehicle.brand].total += vehicle.price;
      acc[vehicle.brand].count += 1;
      return acc;
    },
    {}
  );

  const avgPriceData = Object.keys(avgPriceByBrand).map((brand) => ({
    name: brand,
    value: Math.round(avgPriceByBrand[brand].total / avgPriceByBrand[brand].count),
  }));

  // Status distribution
  const statusData = [
    { name: "Disponível", value: vehicles.filter(v => v.status === "available").length },
    { name: "Vendido", value: vehicles.filter(v => v.status === "sold").length },
    { name: "Reservado", value: vehicles.filter(v => v.status === "reserved").length },
  ];

  // Recent vehicles
  const recentVehicles = [...vehicles]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Recent proposals
  const recentProposals = [...proposals]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Colors for pie chart
  const COLORS = ["#3B82F6", "#FBBF24", "#10B981", "#6366F1", "#EC4899"];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos Cadastrados</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              +{recentVehicles.length} nos últimos 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos Vendidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalSold}</div>
            <p className="text-xs text-muted-foreground">
              Taxa de conversão de {Math.round((dashboardStats.totalSold / dashboardStats.totalVehicles) * 100)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellers.length}</div>
            <p className="text-xs text-muted-foreground">
              Média de {Math.round(vehicles.length / sellers.length)} veículos por vendedor
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposals.length}</div>
            <p className="text-xs text-muted-foreground">
              {proposals.filter(p => p.status === "pending").length} aguardando resposta
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Veículos por Marca</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={brandData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Status dos Veículos</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Veículos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={vehicle.images[0] || "/placeholder.svg"}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {vehicle.brand} {vehicle.model}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {vehicle.year} • {formatCurrency(vehicle.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        vehicle.status === "available"
                          ? "bg-green-100 text-green-800"
                          : vehicle.status === "sold"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {vehicle.status === "available"
                        ? "Disponível"
                        : vehicle.status === "sold"
                        ? "Vendido"
                        : "Reservado"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Propostas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProposals.map((proposal) => (
                <div key={proposal.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{proposal.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {proposal.vehicleInfo.brand} {proposal.vehicleInfo.model} ({proposal.vehicleInfo.year})
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        proposal.status === "pending"
                          ? "bg-blue-100 text-blue-800"
                          : proposal.status === "contacted"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {proposal.status === "pending"
                        ? "Pendente"
                        : proposal.status === "contacted"
                        ? "Contatado"
                        : "Fechado"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

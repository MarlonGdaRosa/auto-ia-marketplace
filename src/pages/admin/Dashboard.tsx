import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Car, RotateCcw } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { getDashboardStats } from "@/services/supabaseService";
import StatCard from "@/components/admin/dashboard/StatCard";
import VehicleStatusChart from "@/components/admin/dashboard/VehicleStatusChart";
import BrandDistributionChart from "@/components/admin/dashboard/BrandDistributionChart";
import ProposalStatusChart from "@/components/admin/dashboard/ProposalStatusChart";
import DashboardSkeleton from "@/components/admin/dashboard/DashboardSkeleton";
import EmptyState from "@/components/admin/dashboard/EmptyState";

const Dashboard: React.FC = () => {
  // Use real data from Supabase
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    refetchOnWindowFocus: true, // Atualiza ao voltar para a aba
  });

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <AdminLayout title="Dashboard">
        <DashboardSkeleton />
      </AdminLayout>
    );
  }

  // If no stats are returned, show empty state
  if (!stats) {
    return (
      <AdminLayout title="Dashboard">
        <EmptyState />
      </AdminLayout>
    );
  }
  
  // Vehicle status data for pie chart
  const vehicleStatusData = [
    { name: "Disponíveis", value: stats.totalVehicles - stats.soldVehicles - stats.reservedVehicles, color: "#10b981" },
    { name: "Vendidos", value: stats.soldVehicles, color: "#f87171" },
    { name: "Reservados", value: stats.reservedVehicles, color: "#fbbf24" },
  ];

  // Proposal status data for bar chart
  const proposalStatusData = [
    { name: "Pendentes", value: stats.pendingProposals, color: "#fbbf24" },
    { name: "Contactados", value: stats.contactedProposals, color: "#3b82f6" },
    { name: "Concluídos", value: stats.closedProposals, color: "#10b981" },
  ];

  // Top brands for pie chart
  const topBrandValue = stats.topBrand?.count || 0;
  const otherBrandsValue = stats.totalVehicles - topBrandValue;
  
  const brandDistributionData = [
    { name: stats.topBrand?.name || 'N/A', value: topBrandValue, color: "#60a5fa" },
    { name: "Outras marcas", value: otherBrandsValue, color: "#93c5fd" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          title="Atualizar dados"
        >
          <RotateCcw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Veículos"
          value={stats.totalVehicles}
          icon={<Car className="h-4 w-4 text-gray-500" />}
          footerItems={[
            { label: "vendidos", value: stats.soldVehicles },
            { label: "reservados", value: stats.reservedVehicles }
          ]}
          progressValue={(stats.soldVehicles + stats.reservedVehicles) / (stats.totalVehicles || 1) * 100}
        />

        <StatCard
          title="Propostas"
          value={stats.totalProposals}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          }
          footerItems={[
            { label: "pendentes", value: stats.pendingProposals, color: "yellow-400" },
            { label: "concluídas", value: stats.closedProposals, color: "green-500" }
          ]}
          progressValue={(stats.closedProposals) / (stats.totalProposals || 1) * 100}
        />

        <StatCard
          title="Marca mais popular"
          value={stats.topBrand?.name || "N/A"}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          }
          footerItems={[
            { label: "veículos", value: stats.topBrand?.count || 0 },
            { 
              label: "% do total", 
              value: stats.topBrand?.count && stats.totalVehicles 
                ? Math.round((stats.topBrand.count / stats.totalVehicles) * 100) 
                : 0 
            }
          ]}
          progressValue={
            stats.topBrand?.count && stats.totalVehicles 
              ? (stats.topBrand.count / stats.totalVehicles) * 100 
              : 0
          }
        />

        <StatCard
          title="Novas propostas"
          value={stats.newProposals}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          }
          footerItems={[
            { 
              label: "% do total de propostas", 
              value: stats.newProposals && stats.totalProposals 
                ? Math.round((stats.newProposals / stats.totalProposals) * 100)
                : 0
            }
          ]}
          progressValue={
            stats.newProposals && stats.totalProposals 
              ? (stats.newProposals / stats.totalProposals) * 100
              : 0
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <VehicleStatusChart data={vehicleStatusData} />
        <BrandDistributionChart data={brandDistributionData} />
      </div>

      <div className="mt-4">
        <ProposalStatusChart data={proposalStatusData} />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

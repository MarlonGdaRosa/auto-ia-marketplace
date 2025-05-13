
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardStats } from "@/services/mockData"; // Update from mock to real service
import { DashboardStats } from "@/types";
import { formatCurrency } from "@/lib/format";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AdminLayout from "@/components/AdminLayout";
import { Car, BarChart3 } from "lucide-react";

const Dashboard: React.FC = () => {
  // Set up a query
  const { data: stats = dashboardStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => Promise.resolve(dashboardStats), // Replace with actual API call
  });

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

  // For rendering with ResponsiveContainer
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <path
          d={describeArc(cx, cy, innerRadius, outerRadius, startAngle, endAngle)}
          fill={fill}
        />
      </g>
    );
  };

  // Helper function for custom arc rendering
  const describeArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
    const startRadians = startAngle * Math.PI / 180;
    const endRadians = endAngle * Math.PI / 180;
    
    const innerStartX = x + innerRadius * Math.cos(startRadians);
    const innerStartY = y + innerRadius * Math.sin(startRadians);
    const innerEndX = x + innerRadius * Math.cos(endRadians);
    const innerEndY = y + innerRadius * Math.sin(endRadians);
    
    const outerStartX = x + outerRadius * Math.cos(startRadians);
    const outerStartY = y + outerRadius * Math.sin(startRadians);
    const outerEndX = x + outerRadius * Math.cos(endRadians);
    const outerEndY = y + outerRadius * Math.sin(endRadians);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return [
      `M ${innerStartX} ${innerStartY}`,
      `L ${outerStartX} ${outerStartY}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
      `L ${innerEndX} ${innerEndY}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
      'Z'
    ].join(' ');
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{payload[0].name}: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Veículos
            </CardTitle>
            <Car className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-500">{stats.soldVehicles} vendidos</div>
              <div className="text-xs text-gray-500">{stats.reservedVehicles} reservados</div>
            </div>
            <Progress 
              value={(stats.soldVehicles + stats.reservedVehicles) / stats.totalVehicles * 100} 
              className="h-1 mt-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Propostas
            </CardTitle>
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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProposals}</div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                <div className="text-xs text-gray-500">{stats.pendingProposals} pendentes</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div className="text-xs text-gray-500">{stats.closedProposals} concluídas</div>
              </div>
            </div>
            <Progress 
              value={stats.closedProposals / stats.totalProposals * 100} 
              className="h-1 mt-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Marca mais popular
            </CardTitle>
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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topBrand?.name || "N/A"}</div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">{stats.topBrand?.count || 0} veículos</div>
              <div className="text-xs text-gray-500">
                {stats.topBrand?.count && stats.totalVehicles 
                  ? Math.round((stats.topBrand.count / stats.totalVehicles) * 100) 
                  : 0}% do total
              </div>
            </div>
            <Progress 
              value={stats.topBrand?.count && stats.totalVehicles 
                ? (stats.topBrand.count / stats.totalVehicles) * 100 
                : 0} 
              className="h-1 mt-1"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Novas propostas
            </CardTitle>
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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newProposals}</div>
            <div className="flex items-center mt-2">
              <div className="text-xs text-gray-500">
                {stats.newProposals && stats.totalProposals 
                  ? Math.round((stats.newProposals / stats.totalProposals) * 100)
                  : 0}% do total de propostas
              </div>
            </div>
            <Progress 
              value={stats.newProposals && stats.totalProposals 
                ? (stats.newProposals / stats.totalProposals) * 100
                : 0} 
              className="h-1 mt-1"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Status dos Veículos</CardTitle>
            <CardDescription>Distribuição por status</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    activeShape={renderActiveShape}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {vehicleStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Distribuição de Marcas</CardTitle>
            <CardDescription>Marca principal vs. outras</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={brandDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {brandDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Status das Propostas</CardTitle>
            <CardDescription>Distribuição por status</CardDescription>
          </div>
          <BarChart3 className="h-5 w-5 text-gray-500" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={proposalStatusData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {proposalStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;

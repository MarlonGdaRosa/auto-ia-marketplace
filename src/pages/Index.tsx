
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import VehicleCard from "@/components/VehicleCard";
import VehicleFilter from "@/components/VehicleFilter";
import { FilterOptions, Vehicle } from "@/types";
import { getVehicles } from "@/services/supabaseService";
import { Car } from "lucide-react";

const Index: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({});
  
  const { data: vehicles = [], isLoading, error } = useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => getVehicles(filters)
  });

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <Layout>
      <div className="bg-brand-blue text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Encontre o veículo perfeito para você
          </h1>
          <p className="text-xl text-center mb-6">
            Milhares de opções de carros, motos e caminhões à sua espera
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4">
        {/* Filters - Always shown at the top in both mobile and desktop */}
        <div className="mb-6">
          <VehicleFilter 
            initialFilters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isLoading ? "Buscando..." : `${vehicles.length} veículos encontrados`}
          </h2>
          {/* Add sorting component here if needed */}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 h-64 animate-pulse">
                <div className="w-full h-32 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <Car className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Erro ao carregar veículos</h3>
            <p className="text-gray-500">
              Ocorreu um problema ao buscar os veículos. Por favor, tente novamente.
            </p>
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
              <Car className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum veículo encontrado</h3>
            <p className="text-gray-500">
              Tente ajustar seus filtros para encontrar mais opções.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;


import React, { useState } from "react";
import Layout from "@/components/Layout";
import VehicleCard from "@/components/VehicleCard";
import VehicleFilter from "@/components/VehicleFilter";
import { FilterOptions, Vehicle } from "@/types";
import { getVehicles } from "@/services/mockData";
import { Car } from "lucide-react";

const Index: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const vehicles = getVehicles(filters);

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
          <p className="text-xl text-center mb-8">
            Milhares de opções de carros, motos e caminhões à sua espera
          </p>
          <div className="max-w-2xl mx-auto">
            {/* Banner search components could be added here */}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/12">
            <VehicleFilter 
              initialFilters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>
          
          <div className="w-full md:w-9/12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {vehicles.length} veículos encontrados
              </h2>
              {/* Add sorting component here if needed */}
            </div>

            {vehicles.length > 0 ? (
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
        </div>
      </div>
    </Layout>
  );
};

export default Index;

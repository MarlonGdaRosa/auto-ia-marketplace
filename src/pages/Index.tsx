
import React, { useState } from "react";
import Layout from "@/components/Layout";
import VehicleCard from "@/components/VehicleCard";
import VehicleFilter from "@/components/VehicleFilter";
import { getVehicles } from "@/services/mockData";
import { Vehicle, FilterOptions } from "@/types";

const Index: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  React.useEffect(() => {
    // Load vehicles with filters
    setVehicles(getVehicles(filters));
  }, [filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Encontre seu próximo veículo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <VehicleFilter
              initialFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="md:col-span-3">
            {vehicles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Nenhum veículo encontrado</h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros para ver mais resultados
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

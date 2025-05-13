
import { useState, useEffect } from "react";
import { getVehicleById, getSellers } from "@/services/supabaseService";
import { Vehicle, Seller } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export const useVehicleData = (id: string | undefined) => {
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(false);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const isEditMode = !!id;

  // Get vehicle data if in edit mode
  const fetchVehicleData = async (
    setFormData: (data: Partial<Vehicle>) => void
  ) => {
    if (!isEditMode) return;
    
    setInitialLoading(true);
    try {
      const vehicle = await getVehicleById(id || "");
      if (vehicle) {
        setFormData(vehicle);
      } else {
        toast({
          title: "Erro",
          description: "Veículo não encontrado",
          variant: "destructive"
        });
        navigate("/admin/vehicles");
      }
    } catch (error) {
      console.error("Error loading vehicle:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do veículo",
        variant: "destructive"
      });
      navigate("/admin/vehicles");
    } finally {
      setInitialLoading(false);
    }
  };

  // Fetch sellers
  useEffect(() => {
    const loadSellers = async () => {
      try {
        const sellersData = await getSellers();
        setSellers(sellersData);
      } catch (error) {
        console.error("Error loading sellers:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar vendedores",
          variant: "destructive"
        });
      }
    };

    loadSellers();
  }, []);

  return {
    initialLoading,
    sellers,
    isEditMode,
    fetchVehicleData
  };
};

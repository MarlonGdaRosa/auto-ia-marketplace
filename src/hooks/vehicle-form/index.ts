
import { useVehicleFormState } from "./useVehicleFormState";
import { useVehicleFormHandlers } from "./useVehicleFormHandlers";
import { useVehicleImageHandlers } from "./useVehicleImageHandlers";
import { useVehicleFormSubmit } from "./useVehicleFormSubmit";
import { Vehicle, Seller } from "@/types";
import { useState, useEffect } from "react";
import { getVehicleById, getSellers } from "@/services/supabaseService";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export const useVehicleForm = (id?: string) => {
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(false);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const isEditMode = !!id;
  
  // Form state
  const { formData, setFormData } = useVehicleFormState();
  
  // Form handlers
  const {
    handleChange,
    handlePriceChange,
    handleMileageChange,
    handleFeatureChange,
    handleSelectChange,
    handleStateChange,
    handleCityChange,
  } = useVehicleFormHandlers(formData, setFormData);
  
  // Image handlers
  const { handleImageUpload, handleRemoveImage } = useVehicleImageHandlers(
    formData,
    setFormData
  );
  
  // Submit handler
  const { loading, handleSubmit } = useVehicleFormSubmit(
    id,
    formData,
    isEditMode
  );
  
  // Fetch vehicle data if in edit mode
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!isEditMode) return;
      
      setInitialLoading(true);
      try {
        console.log('Fetching vehicle by ID:', id);
        const vehicle = await getVehicleById(id || "");
        if (vehicle) {
          console.log('Vehicle data retrieved:', vehicle);
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
    
    fetchVehicleData();
  }, [id, isEditMode, navigate, setFormData]);

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
    formData,
    initialLoading,
    loading,
    sellers,
    isEditMode,
    handleChange,
    handlePriceChange,
    handleMileageChange,
    handleFeatureChange,
    handleSelectChange,
    handleStateChange,
    handleCityChange,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
    setFormData
  };
};

export * from "./useVehicleFormState";
export * from "./useVehicleFormHandlers";
export * from "./useVehicleImageHandlers";
export * from "./useVehicleFormSubmit";

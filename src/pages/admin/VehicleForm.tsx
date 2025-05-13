
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { getVehicleById, getSellers } from "@/services/supabaseService";
import FipeVehicleSelector from "@/components/FipeVehicleSelector";
import LocationSelector from "@/components/LocationSelector";
import { Vehicle, Seller } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useVehicleForm } from "@/hooks/useVehicleForm";
import VehicleBasicInfoForm from "@/components/admin/vehicles/VehicleBasicInfoForm";
import VehicleSpecsForm from "@/components/admin/vehicles/VehicleSpecsForm";
import VehicleFeaturesForm from "@/components/admin/vehicles/VehicleFeaturesForm";
import VehicleDescriptionForm from "@/components/admin/vehicles/VehicleDescriptionForm";
import VehicleImagesForm from "@/components/admin/vehicles/VehicleImagesForm";

const VehicleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(false);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [fipePrice, setFipePrice] = useState<any>(null);

  // Get vehicle form hook
  const {
    formData,
    loading,
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
  } = useVehicleForm(id);

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

  // Get vehicle data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadVehicle = async () => {
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

      loadVehicle();
    }
  }, [id, isEditMode, navigate, setFormData]);

  if (initialLoading) {
    return (
      <AdminLayout title={isEditMode ? "Carregando Veículo..." : "Novo Veículo"}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditMode ? "Editar Veículo" : "Novo Veículo"}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 gap-6">
            {/* FIPE Vehicle Selector */}
            <FipeVehicleSelector 
              onBrandChange={(brand) => setFormData({...formData, brand})}
              onModelChange={(model) => setFormData({...formData, model})}
              onYearChange={(year) => setFormData({...formData, year})}
              onFuelChange={(fuel) => setFormData({...formData, fuel})}
              onFipePriceChange={setFipePrice}
              initialBrand={formData.brand}
              initialModel={formData.model}
              initialYear={formData.year}
            />

            <VehicleBasicInfoForm 
              formData={formData}
              handlePriceChange={handlePriceChange}
              handleMileageChange={handleMileageChange}
              handleSelectChange={handleSelectChange}
              sellers={sellers}
            />

            <Separator />

            <VehicleSpecsForm 
              formData={formData}
              handleSelectChange={handleSelectChange}
              sellers={sellers}
            />

            <Separator />

            {/* Location Selector - IBGE API integration */}
            <div className="grid grid-cols-1 gap-4">
              <LocationSelector 
                onStateChange={handleStateChange}
                onCityChange={handleCityChange}
                initialState={formData.location?.state}
                initialCity={formData.location?.city}
              />
              
              <div className="space-y-2">
                <label htmlFor="location.region">Região</label>
                <Input
                  id="location.region"
                  name="location.region"
                  value={formData.location?.region || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Separator />

            <VehicleFeaturesForm 
              formData={formData}
              handleFeatureChange={handleFeatureChange}
            />

            <VehicleDescriptionForm 
              formData={formData}
              handleChange={handleChange}
            />

            <VehicleImagesForm 
              formData={formData}
              handleImageUpload={handleImageUpload}
              handleRemoveImage={handleRemoveImage}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/vehicles")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Salvando..." : "Cadastrando..."}
                </>
              ) : (
                <>{isEditMode ? "Salvar" : "Cadastrar"}</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default VehicleForm;

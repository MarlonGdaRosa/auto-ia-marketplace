
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import TextVehicleInfo from "@/components/TextVehicleInfo";
import LocationSelector from "@/components/LocationSelector";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useVehicleForm } from "@/hooks/useVehicleForm";
import VehicleBasicInfoForm from "@/components/admin/vehicles/VehicleBasicInfoForm";
import VehicleSpecsForm from "@/components/admin/vehicles/VehicleSpecsForm";
import VehicleFeaturesForm from "@/components/admin/vehicles/VehicleFeaturesForm";
import VehicleDescriptionForm from "@/components/admin/vehicles/VehicleDescriptionForm";
import VehicleImagesForm from "@/components/admin/vehicles/VehicleImagesForm";
import VehicleFormLoading from "@/components/admin/vehicles/VehicleFormLoading";
import VehicleFormActions from "@/components/admin/vehicles/VehicleFormActions";

const VehicleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const {
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
  } = useVehicleForm(id);

  if (initialLoading) {
    return (
      <AdminLayout title={isEditMode ? "Carregando Veículo..." : "Novo Veículo"}>
        <VehicleFormLoading isEditMode={isEditMode} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditMode ? "Editar Veículo" : "Novo Veículo"}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          {/* Text Vehicle Info */}
          <TextVehicleInfo 
            onBrandChange={(brand) => setFormData({...formData, brand})}
            onModelChange={(model) => setFormData({...formData, model})}
            onYearChange={(year) => setFormData({...formData, year})}
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

          {/* Location Section */}
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

          <VehicleFormActions loading={loading} isEditMode={isEditMode} />
        </div>
      </form>
    </AdminLayout>
  );
};

export default VehicleForm;

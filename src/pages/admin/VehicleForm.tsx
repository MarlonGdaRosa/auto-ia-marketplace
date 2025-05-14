import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleBasicInfoForm from "@/components/admin/vehicles/VehicleBasicInfoForm";
import VehicleDescriptionForm from "@/components/admin/vehicles/VehicleDescriptionForm";
import VehicleFeaturesForm from "@/components/admin/vehicles/VehicleFeaturesForm";
import VehicleImagesForm from "@/components/admin/vehicles/VehicleImagesForm";
import VehicleSpecsForm from "@/components/admin/vehicles/VehicleSpecsForm";
import VehicleFormActions from "@/components/admin/vehicles/VehicleFormActions";
import VehicleFormLoading from "@/components/admin/vehicles/VehicleFormLoading";
import { useQuery } from "@tanstack/react-query";
import { getSellers } from "@/services/supabaseService";
import { useVehicleForm } from "@/hooks/useVehicleForm";
import { Seller } from "@/types";

const VehicleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const {
    formData,
    setFormData,
    handleInputChange,
    handleSelectChange,
    handleStateChange,
    handleCityChange,
    handleFipeData,
    handleSubmit,
    isSubmitting,
    handleFileChange,
    removeImage,
    isLoadingVehicle,
    existingVehicle,
  } = useVehicleForm({ vehicleId: id });

  const { data: sellers, isLoading: isLoadingSellers } = useQuery<Seller[]>({
    queryKey: ["sellers"],
    queryFn: getSellers,
  });

  if (
    isEditing &&
    (isLoadingVehicle ||
      !existingVehicle ||
      isLoadingSellers ||
      !sellers ||
      !formData ||
      Object.keys(formData).length === 0)
  ) {
    return <VehicleFormLoading />;
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="specs">Especificações</TabsTrigger>
            <TabsTrigger value="features">Características</TabsTrigger>
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="images">Imagens</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <VehicleBasicInfoForm
              formData={formData}
              handlePriceChange={(value) => handleSelectChange("price", Number(value))}
              handleMileageChange={(value) => handleSelectChange("mileage", Number(value))}
              handleSelectChange={handleSelectChange}
              handleStateChange={handleStateChange}
              handleCityChange={handleCityChange}
              sellers={sellers || []}
            />
          </TabsContent>

          <TabsContent value="specs">
            <VehicleSpecsForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
            />
          </TabsContent>

          <TabsContent value="features">
            <VehicleFeaturesForm
              formData={formData}
              handleSelectChange={handleSelectChange}
            />
          </TabsContent>

          <TabsContent value="description">
            <VehicleDescriptionForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </TabsContent>

          <TabsContent value="images">
            <VehicleImagesForm
              formData={formData}
              handleFileChange={handleFileChange}
              removeImage={removeImage}
            />
          </TabsContent>
        </Tabs>

        <VehicleFormActions isSubmitting={isSubmitting} onCancel={() => navigate("/admin/vehicles")} />
      </form>
    </AdminLayout>
  );
};

export default VehicleForm;

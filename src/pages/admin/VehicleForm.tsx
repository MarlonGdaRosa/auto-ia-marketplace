
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { useToast } from "@/components/ui/use-toast";
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

  // Use our custom hook for form state management
  const {
    formData,
    setFormData,
    handleInputChange,
    handleSelectChange,
    handleFipeData,
    handleSubmit,
    isSubmitting,
    handleFileChange,
    removeImage,
    reorderImages,
    isLoadingVehicle,
    error
  } = useVehicleForm({ vehicleId: id });

  // Load sellers for assignment
  const { data: sellers = [] } = useQuery<Seller[]>({
    queryKey: ["sellers"],
    queryFn: getSellers,
  });

  // Show loading state while fetching vehicle data
  if (isEditing && isLoadingVehicle) {
    return <VehicleFormLoading isEditMode={isEditing} />;
  }

  // Handle fetch error
  if (error) {
    toast({
      variant: "destructive",
      title: "Erro ao carregar veículo",
      description: "Não foi possível carregar os dados do veículo."
    });
  }

  return (
    <AdminLayout title={isEditing ? "Editar Veículo" : "Novo Veículo"}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Tabs defaultValue="basic" className="mb-8">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="specs">Especificações</TabsTrigger>
            <TabsTrigger value="features">Características</TabsTrigger>
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="images">Imagens</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <VehicleBasicInfoForm 
              formData={formData}
              onChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onFipeData={handleFipeData}
            />
          </TabsContent>
          
          <TabsContent value="specs" className="space-y-6">
            <VehicleSpecsForm 
              formData={formData}
              handleSelectChange={handleSelectChange}
              sellers={sellers}
            />
          </TabsContent>
          
          <TabsContent value="features" className="space-y-6">
            <VehicleFeaturesForm
              formData={formData}
              onChange={setFormData}
            />
          </TabsContent>
          
          <TabsContent value="description" className="space-y-6">
            <VehicleDescriptionForm
              formData={formData}
              handleChange={handleInputChange}
            />
          </TabsContent>
          
          <TabsContent value="images" className="space-y-6">
            <VehicleImagesForm
              formData={formData}
              onFileChange={handleFileChange}
              onRemoveImage={removeImage}
              onReorderImages={reorderImages}
            />
          </TabsContent>
        </Tabs>
        
        <VehicleFormActions
          isSubmitting={isSubmitting}
          onCancel={() => navigate('/admin/vehicles')}
        />
      </form>
    </AdminLayout>
  );
};

export default VehicleForm;

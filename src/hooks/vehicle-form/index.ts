
import { useVehicleFormState } from "./useVehicleFormState";
import { useVehicleFormHandlers } from "./useVehicleFormHandlers";
import { useVehicleImageHandlers } from "./useVehicleImageHandlers";
import { useVehicleFormSubmit } from "./useVehicleFormSubmit";
import { useVehicleData } from "./useVehicleData";
import { Vehicle } from "@/types";

export const useVehicleForm = (id?: string, initialData?: Partial<Vehicle>) => {
  const isEditMode = !!id;
  
  const { formData, setFormData } = useVehicleFormState(initialData);
  
  const {
    handleChange,
    handlePriceChange,
    handleMileageChange,
    handleFeatureChange,
    handleSelectChange,
    handleStateChange,
    handleCityChange,
  } = useVehicleFormHandlers(formData, setFormData);
  
  const { handleImageUpload, handleRemoveImage } = useVehicleImageHandlers(
    formData,
    setFormData
  );
  
  const { loading, handleSubmit } = useVehicleFormSubmit(
    id,
    formData,
    isEditMode
  );

  return {
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
  };
};

export * from "./useVehicleFormState";
export * from "./useVehicleFormHandlers";
export * from "./useVehicleImageHandlers";
export * from "./useVehicleFormSubmit";
export * from "./useVehicleData";

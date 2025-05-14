
import { useVehicleFormImplementation } from "./vehicle-form/useVehicleFormImplementation";
import { Vehicle } from "@/types";
import { getVehicleById } from "@/services/supabaseService";
import { useQuery } from "@tanstack/react-query";
import { useVehicleFormHandlers } from "./vehicle-form";

export interface UseVehicleFormOptions {
  vehicleId?: string;
  initialData?: Vehicle;
}

export const useVehicleForm = (options?: UseVehicleFormOptions) => {
  const { vehicleId, initialData } = options || {};
  
  // Load existing vehicle data if we have a vehicleId
  const {
    data: existingVehicle,
    isLoading,
    error
  } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => vehicleId ? getVehicleById(vehicleId) : null,
    enabled: !!vehicleId && !initialData,
  });
  
  // Use the main implementation
  const vehicleForm = useVehicleFormImplementation({
    initialData: initialData || existingVehicle
  });

  // Get additional form handlers
  const { handleStateChange, handleCityChange } = useVehicleFormHandlers(
    vehicleForm.formData, 
    vehicleForm.setFormData
  );

  // Modify the handleSubmit to accept and process the form event
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    return vehicleForm.handleSubmit();
  };

  return {
    ...vehicleForm,
    handleSubmit,
    handleStateChange,
    handleCityChange,
    isLoadingVehicle: isLoading,
    error,
    existingVehicle: initialData || existingVehicle
  };
};

export default useVehicleForm;


import { useVehicleFormImplementation } from "./vehicle-form/useVehicleFormImplementation";
import { Vehicle } from "@/types";
import { getVehicleById } from "@/services/supabaseService";
import { useQuery } from "@tanstack/react-query";

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

  return {
    ...vehicleForm,
    isLoadingVehicle: isLoading,
    error,
    existingVehicle: initialData || existingVehicle
  };
};

export default useVehicleForm;

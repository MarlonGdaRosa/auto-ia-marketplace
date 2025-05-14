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

  // Carrega o veículo se houver vehicleId
  const {
    data: existingVehicle,
    isLoading,
    error
  } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => vehicleId ? getVehicleById(vehicleId) : null,
    enabled: !!vehicleId && !initialData,
  });

  // Só inicializa o formulário quando os dados estiverem prontos
  const shouldInitialize =
    !vehicleId || !!initialData || (!!existingVehicle && !isLoading);

  // Só chama o hook de implementação quando os dados estão prontos
  const vehicleForm = useVehicleFormImplementation({
    initialData: initialData || existingVehicle
  });

  // Handlers extras // Handlers extras
  const { handleStateChange, handleCityChange } = useVehicleFormHandlers(
    vehicleForm.formData,
    vehicleForm.setFormData
  );

  // handleSubmit adaptado
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
    isLoadingVehicle: isLoading || !shouldInitialize,
    error,
    existingVehicle: initialData || existingVehicle
  };
};

export default useVehicleForm;

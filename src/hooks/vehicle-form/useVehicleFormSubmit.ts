
import { useState } from "react";
import { Vehicle } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { createVehicle, updateVehicle } from "@/services/supabaseService";
import { useNavigate } from "react-router-dom";

export const useVehicleFormSubmit = (
  id: string | undefined,
  formData: Partial<Vehicle>,
  isEditMode: boolean
) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.brand ||
        !formData.model ||
        !formData.year ||
        !formData.price ||
        !formData.location?.state ||
        !formData.location?.city
      ) {
        toast({
          title: "Erro de validação",
          description: "Por favor, preencha todos os campos obrigatórios",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log("Submitting vehicle data:", formData);

      let result;
      if (isEditMode) {
        result = await updateVehicle(id!, {
          ...formData,
          updated_at: new Date().toISOString()
        });
      } else {
        result = await createVehicle(formData);
      }

      if (result) {
        toast({
          title: isEditMode ? "Veículo atualizado" : "Veículo cadastrado",
          description: isEditMode
            ? "Veículo atualizado com sucesso!"
            : "Veículo cadastrado com sucesso!",
        });
        navigate("/admin/vehicles");
      } else {
        throw new Error("Falha ao salvar o veículo");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Erro",
        description: isEditMode
          ? "Erro ao atualizar veículo"
          : "Erro ao cadastrar veículo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit
  };
};

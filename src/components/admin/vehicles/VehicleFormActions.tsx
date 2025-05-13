
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface VehicleFormActionsProps {
  loading: boolean;
  isEditMode: boolean;
}

const VehicleFormActions: React.FC<VehicleFormActionsProps> = ({ loading, isEditMode }) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default VehicleFormActions;

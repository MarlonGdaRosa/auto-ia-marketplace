
import React from "react";
import { Loader2 } from "lucide-react";

interface VehicleFormLoadingProps {
  isEditMode: boolean;
}

const VehicleFormLoading: React.FC<VehicleFormLoadingProps> = ({ isEditMode }) => {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  );
};

export default VehicleFormLoading;

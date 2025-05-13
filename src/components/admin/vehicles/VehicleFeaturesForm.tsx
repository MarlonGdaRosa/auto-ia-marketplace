
import React from "react";
import { Vehicle } from "@/types";
import { Label } from "@/components/ui/label";

interface VehicleFeaturesFormProps {
  formData: Partial<Vehicle>;
  handleFeatureChange: (e: React.ChangeEvent<HTMLInputElement>, feature: string) => void;
}

const VehicleFeaturesForm: React.FC<VehicleFeaturesFormProps> = ({
  formData,
  handleFeatureChange,
}) => {
  const featuresList = [
    "Ar condicionado",
    "Direção hidráulica",
    "Direção elétrica",
    "Vidros elétricos",
    "Travas elétricas",
    "Airbag",
    "ABS",
    "Câmera de ré",
    "Sensor de estacionamento",
    "Central multimídia",
    "Bancos em couro",
    "Alarme",
    "Rodas de liga leve",
    "Computador de bordo",
    "Piloto automático",
    "Teto solar",
  ];

  return (
    <div className="space-y-2">
      <Label>Características/Acessórios</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {featuresList.map((feature) => (
          <label
            key={feature}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
          >
            <input
              type="checkbox"
              checked={(formData.features || []).includes(feature)}
              onChange={(e) => handleFeatureChange(e, feature)}
              className="h-4 w-4"
            />
            <span>{feature}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default VehicleFeaturesForm;

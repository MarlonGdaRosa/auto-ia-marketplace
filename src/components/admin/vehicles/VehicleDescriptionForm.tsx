
import React from "react";
import { Vehicle } from "@/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface VehicleDescriptionFormProps {
  formData: Partial<Vehicle>;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const VehicleDescriptionForm: React.FC<VehicleDescriptionFormProps> = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Descrição</Label>
      <Textarea
        id="description"
        name="description"
        rows={5}
        value={formData.description || ""}
        onChange={handleChange}
      />
    </div>
  );
};

export default VehicleDescriptionForm;


import React from "react";
import { Vehicle } from "@/types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Seller } from "@/types";

interface VehicleSpecsFormProps {
  formData: Partial<Vehicle>;
  handleSelectChange: (field: string, value: string) => void;
  sellers: Seller[];
}

const VehicleSpecsForm: React.FC<VehicleSpecsFormProps> = ({
  formData,
  handleSelectChange,
  sellers,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="transmission">Câmbio</Label>
        <Select
          value={formData.transmission || "manual"}
          onValueChange={(value) => handleSelectChange("transmission", value)}
        >
          <SelectTrigger id="transmission">
            <SelectValue placeholder="Selecione o câmbio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="automatic">Automático</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fuel">Combustível</Label>
        <Select
          value={formData.fuel || "flex"}
          onValueChange={(value) => handleSelectChange("fuel", value)}
        >
          <SelectTrigger id="fuel">
            <SelectValue placeholder="Selecione o combustível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gasoline">Gasolina</SelectItem>
            <SelectItem value="ethanol">Etanol</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
            <SelectItem value="electric">Elétrico</SelectItem>
            <SelectItem value="hybrid">Híbrido</SelectItem>
            <SelectItem value="flex">Flex</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="seller">Vendedor</Label>
        <Select
          value={formData.seller_id || ""}
          onValueChange={(value) => handleSelectChange("seller_id", value)}
        >
          <SelectTrigger id="seller">
            <SelectValue placeholder="Selecione o vendedor" />
          </SelectTrigger>
          <SelectContent>
            {sellers.map((seller) => (
              <SelectItem key={seller.id} value={seller.id}>
                {seller.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VehicleSpecsForm;

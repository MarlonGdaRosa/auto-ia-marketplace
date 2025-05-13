
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
import { formatCurrency } from "@/lib/format";
import CurrencyInput from "react-currency-input-field";
import { Seller } from "@/types";

interface VehicleBasicInfoFormProps {
  formData: Partial<Vehicle>;
  handlePriceChange: (value: string | undefined) => void;
  handleMileageChange: (value: string | undefined) => void;
  handleSelectChange: (field: string, value: string) => void;
  sellers: Seller[];
}

const VehicleBasicInfoForm: React.FC<VehicleBasicInfoFormProps> = ({
  formData,
  handlePriceChange,
  handleMileageChange,
  handleSelectChange,
  sellers,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="price">
          Preço (R$) <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <CurrencyInput
            id="price"
            name="price"
            placeholder="R$ 0,00"
            defaultValue={formData.price}
            decimalsLimit={2}
            decimalSeparator=","
            groupSeparator="."
            prefix="R$ "
            onValueChange={handlePriceChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="mileage">Quilometragem</Label>
        <div className="relative">
          <CurrencyInput
            id="mileage"
            name="mileage"
            placeholder="0 km"
            defaultValue={formData.mileage}
            decimalsLimit={0}
            decimalSeparator=""
            groupSeparator="."
            suffix=" km"
            onValueChange={handleMileageChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status || "available"}
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Disponível</SelectItem>
            <SelectItem value="sold">Vendido</SelectItem>
            <SelectItem value="reserved">Reservado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VehicleBasicInfoForm;

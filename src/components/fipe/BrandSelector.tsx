
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { VehicleBrand } from "@/services/vehicle/types";

interface BrandSelectorProps {
  brands: VehicleBrand[];
  selectedBrandId: string;
  onBrandChange: (brandId: string) => void;
  isLoading: boolean;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({
  brands,
  selectedBrandId,
  onBrandChange,
  isLoading
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="brand">
        Marca <span className="text-red-500">*</span>
      </Label>
      <Select
        value={selectedBrandId}
        onValueChange={onBrandChange}
        disabled={isLoading}
      >
        <SelectTrigger id="brand" className="relative">
          <SelectValue placeholder="Selecione a marca" />
          {isLoading && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </SelectTrigger>
        <SelectContent>
          {brands.length > 0 ? (
            brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.nome}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="empty" disabled>
              Nenhuma marca encontrada
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BrandSelector;

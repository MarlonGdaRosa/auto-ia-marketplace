
import React, { useState } from "react";
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
import TextVehicleInfo from "@/components/TextVehicleInfo";
import FipeVehicleSelector from "@/components/FipeVehicleSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VehicleBasicInfoFormProps {
  formData: Partial<Vehicle>;
  handlePriceChange: (value: string | undefined) => void;
  handleMileageChange: (value: string | undefined) => void;
  handleSelectChange: (field: string, value: string) => void;
  handleStateChange?: (state: string) => void;
  handleCityChange?: (city: string) => void;
  sellers: Seller[];
}

const VehicleBasicInfoForm: React.FC<VehicleBasicInfoFormProps> = ({
  formData,
  handlePriceChange,
  handleMileageChange,
  handleSelectChange,
  handleStateChange,
  handleCityChange,
  sellers,
}) => {
  const [vehicleInputMode, setVehicleInputMode] = useState<"manual" | "fipe">("manual");
  
  const handleBrandChange = (brand: string) => {
    handleSelectChange("brand", brand);
  };
  
  const handleModelChange = (model: string) => {
    handleSelectChange("model", model);
  };
  
  const handleYearChange = (year: number) => {
    handleSelectChange("year", year.toString());
  };
  
  const handleFuelChange = (fuel: string) => {
    handleSelectChange("fuel", fuel);
  };

  const onStateChange = (state: string) => {
    if (handleStateChange) {
      handleStateChange(state);
    } else {
      // Fallback to use handleSelectChange for location
      const newLocation = {
        ...formData.location,
        state: state
      };
      handleSelectChange("location", JSON.stringify(newLocation));
    }
  };
  
  const onCityChange = (city: string) => {
    if (handleCityChange) {
      handleCityChange(city);
    } else {
      // Fallback to use handleSelectChange for location
      const newLocation = {
        ...formData.location,
        city: city
      };
      handleSelectChange("location", JSON.stringify(newLocation));
    }
  };
  
  const handleFipePriceChange = (fipeData: any) => {
    if (fipeData && fipeData.preco) {
      // Convert price string like "R$ 50.000,00" to number
      const priceStr = fipeData.preco.replace('R$ ', '').replace('.', '').replace(',', '.');
      const priceNum = parseFloat(priceStr);
      if (!isNaN(priceNum)) {
        handlePriceChange(priceNum.toString());
      }
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={vehicleInputMode}
        onValueChange={(value) => setVehicleInputMode(value as "manual" | "fipe")}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Preenchimento Manual</TabsTrigger>
          <TabsTrigger value="fipe">Usar Tabela FIPE</TabsTrigger>
        </TabsList>
        <TabsContent value="manual" className="pt-4">
          <TextVehicleInfo
            initialBrand={formData.brand}
            initialModel={formData.model}
            initialYear={formData.year}
            initialState={formData.location?.state}
            initialCity={formData.location?.city}
            onBrandChange={handleBrandChange}
            onModelChange={handleModelChange}
            onYearChange={handleYearChange}
            onStateChange={onStateChange}
            onCityChange={onCityChange}
          />
        </TabsContent>
        <TabsContent value="fipe" className="pt-4">
          <FipeVehicleSelector
            onBrandChange={handleBrandChange}
            onModelChange={handleModelChange}
            onYearChange={handleYearChange}
            onFuelChange={handleFuelChange}
            onFipePriceChange={handleFipePriceChange}
            initialBrand={formData.brand}
            initialModel={formData.model}
            initialYear={formData.year}
          />
          
          <div className="mt-6">
            <LocationSelector
              onStateChange={onStateChange}
              onCityChange={onCityChange}
              initialState={formData.location?.state}
              initialCity={formData.location?.city}
            />
          </div>
        </TabsContent>
      </Tabs>

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
    </div>
  );
};

export default VehicleBasicInfoForm;

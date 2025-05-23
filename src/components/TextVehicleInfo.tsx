
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LocationSelector from "@/components/LocationSelector";

interface TextVehicleInfoProps {
  initialBrand?: string;
  initialModel?: string;
  initialYear?: number;
  initialState?: string;
  initialCity?: string;
  onBrandChange: (brand: string) => void;
  onModelChange: (model: string) => void;
  onYearChange: (year: number) => void;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
}

const TextVehicleInfo: React.FC<TextVehicleInfoProps> = ({
  initialBrand,
  initialModel,
  initialYear,
  initialState,
  initialCity,
  onBrandChange,
  onModelChange,
  onYearChange,
  onStateChange,
  onCityChange,
}) => {
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value);
    if (!isNaN(year)) {
      onYearChange(year);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">
            Marca <span className="text-red-500">*</span>
          </Label>
          <Input
            id="brand"
            name="brand"
            value={initialBrand || ""}
            onChange={(e) => onBrandChange(e.target.value)}
            placeholder="Ex: Honda, Toyota, Volkswagen"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">
            Modelo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="model"
            name="model"
            value={initialModel || ""}
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="Ex: Civic, Corolla, Golf"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">
            Ano <span className="text-red-500">*</span>
          </Label>
          <Input
            id="year"
            name="year"
            type="text"
            value={initialYear || new Date().getFullYear()}
            onChange={handleYearChange}
            placeholder="Ex: 2023"
            required
          />
        </div>
      </div>

      <LocationSelector
        onStateChange={onStateChange}
        onCityChange={onCityChange}
        initialState={initialState}
        initialCity={initialCity}
      />
    </div>
  );
};

export default TextVehicleInfo;

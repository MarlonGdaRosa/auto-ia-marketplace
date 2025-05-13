
import React from "react";
import { useFipeData } from "@/hooks/useFipeData";
import { FipePrice } from "@/services/vehicle/types";
import BrandSelector from "./fipe/BrandSelector";
import ModelSelector from "./fipe/ModelSelector";
import YearSelector from "./fipe/YearSelector";
import FipePriceDisplay from "./fipe/FipePriceDisplay";

interface FipeVehicleSelectorProps {
  onBrandChange: (brand: string) => void;
  onModelChange: (model: string) => void;
  onYearChange: (year: number) => void;
  onFuelChange: (fuel: string) => void;
  onFipePriceChange: (price: FipePrice | null) => void;
  initialBrand?: string;
  initialModel?: string;
  initialYear?: number;
}

const FipeVehicleSelector: React.FC<FipeVehicleSelectorProps> = ({
  onBrandChange,
  onModelChange,
  onYearChange,
  onFuelChange,
  onFipePriceChange,
  initialBrand,
  initialModel,
  initialYear
}) => {
  const {
    brands,
    models,
    years,
    fipePrice,
    loadingBrands,
    loadingModels,
    loadingYears,
    loadingPrice,
    selectedBrandId,
    selectedModelId,
    selectedYearId,
    handleBrandChange,
    handleModelChange,
    handleYearChange
  } = useFipeData({
    initialBrand,
    initialModel,
    initialYear,
    onBrandChange,
    onModelChange,
    onYearChange,
    onFuelChange,
    onFipePriceChange
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BrandSelector 
        brands={brands}
        selectedBrandId={selectedBrandId}
        onBrandChange={handleBrandChange}
        isLoading={loadingBrands}
      />
      
      <ModelSelector 
        models={models}
        selectedModelId={selectedModelId}
        onModelChange={handleModelChange}
        isLoading={loadingModels}
        isBrandSelected={!!selectedBrandId}
      />
      
      <YearSelector 
        years={years}
        selectedYearId={selectedYearId}
        onYearChange={handleYearChange}
        isLoading={loadingYears}
        isModelSelected={!!selectedModelId}
      />
      
      <FipePriceDisplay
        fipePrice={fipePrice}
        isLoading={loadingPrice}
      />
    </div>
  );
};

export default FipeVehicleSelector;

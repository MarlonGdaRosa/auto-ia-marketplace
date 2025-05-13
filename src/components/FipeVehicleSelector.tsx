
import React, { useState, useEffect } from "react";
import { 
  fetchBrands, fetchModelsByBrand, fetchYearsByBrandAndModel, fetchPriceByBrandModelYear 
} from "@/services/vehicleAPI";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FipePrice {
  preco: string;
  combustivel: string;
  marca: string;
  modelo: string;
  anoModelo: number;
  codigoFipe?: string;
  mesReferencia?: string;
}

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
  // State for FIPE API data
  const [brands, setBrands] = useState<{ id: string; nome: string }[]>([]);
  const [models, setModels] = useState<{ id: string; nome: string }[]>([]);
  const [years, setYears] = useState<{ id: string; nome: string }[]>([]);
  const [fipePrice, setFipePrice] = useState<FipePrice | null>(null);
  
  // Loading states
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);
  
  // Selected values
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedYearId, setSelectedYearId] = useState<string>("");

  // Load brands on component mount
  useEffect(() => {
    const loadBrands = async () => {
      setLoadingBrands(true);
      try {
        const brandsData = await fetchBrands();
        console.log("Loaded brands:", brandsData);
        setBrands(brandsData);
        
        // If initial brand is provided, find its ID
        if (initialBrand) {
          const brandObj = brandsData.find(b => b.nome === initialBrand);
          if (brandObj) {
            setSelectedBrandId(brandObj.id);
            handleBrandChange(brandObj.id);
          }
        }
      } catch (error) {
        console.error("Error loading brands:", error);
        toast.error("Erro ao carregar marcas de veículos");
      } finally {
        setLoadingBrands(false);
      }
    };

    loadBrands();
  }, [initialBrand]);

  const handleBrandChange = async (brandId: string) => {
    setSelectedBrandId(brandId);
    setSelectedModelId("");
    setSelectedYearId("");
    setModels([]);
    setYears([]);
    setFipePrice(null);
    
    // Find the selected brand name
    const selectedBrand = brands.find(b => b.id === brandId);
    if (selectedBrand) {
      onBrandChange(selectedBrand.nome);
    }
    
    // Fetch models for selected brand
    if (!brandId) return;
    
    setLoadingModels(true);
    try {
      const modelsData = await fetchModelsByBrand(brandId);
      console.log("Loaded models:", modelsData);
      setModels(modelsData);
      
      // If initial model is provided, find its ID
      if (initialModel) {
        const modelObj = modelsData.find(m => m.nome === initialModel);
        if (modelObj) {
          setSelectedModelId(modelObj.id);
          handleModelChange(modelObj.id);
        }
      }
    } catch (error) {
      console.error("Error loading models:", error);
      toast.error("Erro ao carregar modelos");
    } finally {
      setLoadingModels(false);
    }
  };

  const handleModelChange = async (modelId: string) => {
    setSelectedModelId(modelId);
    setSelectedYearId("");
    setYears([]);
    setFipePrice(null);
    
    // Find the selected model name
    const selectedModel = models.find(m => m.id === modelId);
    if (selectedModel) {
      onModelChange(selectedModel.nome);
    }
    
    // Fetch years for selected model
    if (!selectedBrandId || !modelId) return;
    
    setLoadingYears(true);
    try {
      const yearsData = await fetchYearsByBrandAndModel(selectedBrandId, modelId);
      console.log("Loaded years:", yearsData);
      setYears(yearsData);
      
      // If initial year is provided, find its ID
      if (initialYear) {
        const yearObj = yearsData.find(y => y.nome.includes(initialYear.toString()));
        if (yearObj) {
          setSelectedYearId(yearObj.id);
          handleYearChange(yearObj.id);
        }
      }
    } catch (error) {
      console.error("Error loading years:", error);
      toast.error("Erro ao carregar anos");
    } finally {
      setLoadingYears(false);
    }
  };

  const handleYearChange = async (yearId: string) => {
    setSelectedYearId(yearId);
    setFipePrice(null);
    
    if (!selectedBrandId || !selectedModelId || !yearId) return;
    
    // Extract year from the selected yearId
    const yearParts = yearId.split('-');
    const year = parseInt(yearParts[0]);
    onYearChange(year);
    
    // Fetch price for selected vehicle
    setLoadingPrice(true);
    try {
      const priceData = await fetchPriceByBrandModelYear(selectedBrandId, selectedModelId, yearId);
      console.log("Loaded price:", priceData);
      
      if (priceData) {
        setFipePrice(priceData);
        onFipePriceChange(priceData);
        
        // Set the fuel type based on the FIPE response
        let fuelType: "gasoline" | "ethanol" | "diesel" | "electric" | "hybrid" | "flex" = "flex";
        const fuelLower = priceData.combustivel.toLowerCase();
        
        if (fuelLower.includes("gasolina")) {
          fuelType = "gasoline";
        } else if (fuelLower.includes("álcool") || fuelLower.includes("etanol")) {
          fuelType = "ethanol";
        } else if (fuelLower.includes("diesel")) {
          fuelType = "diesel";
        } else if (fuelLower.includes("elétrico")) {
          fuelType = "electric";
        } else if (fuelLower.includes("híbrido")) {
          fuelType = "hybrid";
        }
        
        onFuelChange(fuelType);
      }
    } catch (error) {
      console.error("Error loading price:", error);
      toast.error("Erro ao carregar preço FIPE");
    } finally {
      setLoadingPrice(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="brand">
          Marca <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedBrandId}
          onValueChange={handleBrandChange}
          disabled={loadingBrands}
        >
          <SelectTrigger id="brand" className="relative">
            <SelectValue placeholder="Selecione a marca" />
            {loadingBrands && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="model">
          Modelo <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedModelId}
          onValueChange={handleModelChange}
          disabled={loadingModels || models.length === 0}
        >
          <SelectTrigger id="model" className="relative">
            <SelectValue placeholder={selectedBrandId ? "Selecione o modelo" : "Selecione a marca primeiro"} />
            {loadingModels && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="year">
          Ano <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedYearId}
          onValueChange={handleYearChange}
          disabled={loadingYears || years.length === 0}
        >
          <SelectTrigger id="year" className="relative">
            <SelectValue placeholder={selectedModelId ? "Selecione o ano" : "Selecione o modelo primeiro"} />
            {loadingYears && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.id} value={year.id}>
                {year.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {loadingPrice && (
        <div className="col-span-1 md:col-span-3 flex items-center justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Consultando tabela FIPE...</span>
        </div>
      )}
      
      {fipePrice && (
        <div className="col-span-1 md:col-span-3 space-y-2 bg-muted p-3 rounded-md">
          <Label>Valor FIPE</Label>
          <div className="text-xl font-semibold">{fipePrice.preco}</div>
          <div className="text-sm text-muted-foreground">
            {fipePrice.marca} {fipePrice.modelo} {fipePrice.anoModelo} - {fipePrice.combustivel}
          </div>
          {fipePrice.mesReferencia && (
            <div className="text-xs text-muted-foreground">
              Ref: {fipePrice.mesReferencia}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FipeVehicleSelector;

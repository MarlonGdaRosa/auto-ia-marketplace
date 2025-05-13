
import { useState, useEffect } from "react";
import { 
  fetchBrands, 
  fetchModelsByBrand, 
  fetchYearsByBrandAndModel, 
  fetchPriceByBrandModelYear 
} from "@/services/vehicle";
import { toast } from "@/hooks/use-toast";
import { VehicleBrand, VehicleModel, VehicleYear, FipePrice } from "@/services/vehicle/types";

interface UseFipeDataProps {
  initialBrand?: string;
  initialModel?: string;
  initialYear?: number;
  onBrandChange: (brand: string) => void;
  onModelChange: (model: string) => void;
  onYearChange: (year: number) => void;
  onFuelChange: (fuel: string) => void;
  onFipePriceChange: (price: FipePrice | null) => void;
}

export const useFipeData = ({
  initialBrand,
  initialModel,
  initialYear,
  onBrandChange,
  onModelChange,
  onYearChange,
  onFuelChange,
  onFipePriceChange
}: UseFipeDataProps) => {
  // State for FIPE API data
  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [years, setYears] = useState<VehicleYear[]>([]);
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
        if (brandsData.length > 0) {
          setBrands(brandsData);
          
          // If initial brand is provided, find its ID
          if (initialBrand) {
            const brandObj = brandsData.find(b => b.nome === initialBrand);
            if (brandObj) {
              setSelectedBrandId(brandObj.id);
              // Only load models if we found a matching brand
              loadModels(brandObj.id);
            }
          }
        } else {
          toast({
            title: "Nenhuma marca encontrada",
            description: "Não foi possível carregar as marcas de veículos",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error loading brands:", error);
        toast({
          title: "Erro ao carregar marcas de veículos",
          variant: "destructive"
        });
      } finally {
        setLoadingBrands(false);
      }
    };

    loadBrands();
  }, [initialBrand]);

  // Load models when brand changes or is initialized
  const loadModels = async (brandId: string) => {
    if (!brandId) return;
    
    // Reset dependent fields
    setSelectedModelId("");
    setSelectedYearId("");
    setYears([]);
    setFipePrice(null);
    
    setLoadingModels(true);
    try {
      const modelsData = await fetchModelsByBrand(brandId);
      console.log("Loaded models:", modelsData);
      
      if (modelsData.length > 0) {
        setModels(modelsData);
        
        // If initial model is provided, find its ID
        if (initialModel) {
          const modelObj = modelsData.find(m => m.nome === initialModel);
          if (modelObj) {
            setSelectedModelId(modelObj.id);
            // Only load years if we found a matching model
            loadYears(brandId, modelObj.id);
          }
        }
      } else {
        toast({
          title: "Nenhum modelo encontrado",
          description: "Não foi possível carregar os modelos para esta marca",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error loading models:", error);
      toast({
        title: "Erro ao carregar modelos",
        variant: "destructive"
      });
    } finally {
      setLoadingModels(false);
    }
  };

  // Load years when model changes or is initialized
  const loadYears = async (brandId: string, modelId: string) => {
    if (!brandId || !modelId) return;
    
    // Reset dependent fields
    setSelectedYearId("");
    setFipePrice(null);
    
    setLoadingYears(true);
    try {
      const yearsData = await fetchYearsByBrandAndModel(brandId, modelId);
      console.log("Loaded years:", yearsData);
      
      if (yearsData.length > 0) {
        setYears(yearsData);
        
        // If initial year is provided, find its ID
        if (initialYear) {
          const yearObj = yearsData.find(y => y.nome.includes(initialYear.toString()));
          if (yearObj) {
            setSelectedYearId(yearObj.id);
            // Only load price if we found a matching year
            loadPrice(brandId, modelId, yearObj.id);
          }
        }
      } else {
        toast({
          title: "Nenhum ano encontrado",
          description: "Não foi possível carregar os anos para este modelo",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error loading years:", error);
      toast({
        title: "Erro ao carregar anos",
        variant: "destructive"
      });
    } finally {
      setLoadingYears(false);
    }
  };

  // Load price when year changes or is initialized
  const loadPrice = async (brandId: string, modelId: string, yearId: string) => {
    if (!brandId || !modelId || !yearId) return;
    
    setLoadingPrice(true);
    try {
      const priceData = await fetchPriceByBrandModelYear(brandId, modelId, yearId);
      console.log("Loaded price:", priceData);
      
      if (priceData) {
        setFipePrice(priceData);
        onFipePriceChange(priceData);
        
        // Extract year from the selected yearId
        const yearParts = yearId.split('-');
        const year = parseInt(yearParts[0]);
        onYearChange(year);
        
        // Set the fuel type based on the FIPE response
        let fuelType = "flex";
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
      } else {
        toast({
          title: "Preço FIPE não encontrado",
          description: "Não foi possível obter o valor FIPE para este veículo",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error loading price:", error);
      toast({
        title: "Erro ao carregar preço FIPE",
        variant: "destructive"
      });
    } finally {
      setLoadingPrice(false);
    }
  };

  // Handlers for selection changes
  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
    
    // Find the selected brand name
    const selectedBrand = brands.find(b => b.id === brandId);
    if (selectedBrand) {
      onBrandChange(selectedBrand.nome);
    }
    
    // Reset dependent states completely
    setSelectedModelId("");
    setSelectedYearId("");
    setModels([]);
    setYears([]);
    setFipePrice(null);
    onFipePriceChange(null);
    
    // Load models for the selected brand
    if (brandId) {
      loadModels(brandId);
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    
    // Find the selected model name
    const selectedModel = models.find(m => m.id === modelId);
    if (selectedModel) {
      onModelChange(selectedModel.nome);
    }
    
    // Reset dependent states
    setSelectedYearId("");
    setYears([]);
    setFipePrice(null);
    onFipePriceChange(null);
    
    // Load years for the selected model
    if (selectedBrandId && modelId) {
      loadYears(selectedBrandId, modelId);
    }
  };

  const handleYearChange = (yearId: string) => {
    setSelectedYearId(yearId);
    
    // Reset price info
    setFipePrice(null);
    onFipePriceChange(null);
    
    // Load price for the selected year
    if (selectedBrandId && selectedModelId && yearId) {
      loadPrice(selectedBrandId, selectedModelId, yearId);
    }
  };

  return {
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
  };
};

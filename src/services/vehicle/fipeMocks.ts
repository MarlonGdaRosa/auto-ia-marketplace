
import { VehicleBrand, VehicleModel, VehicleYear, FipePrice } from './types';

// Fallback for local development or when FIPE API is unavailable
export const fetchBrandsMock = async (): Promise<VehicleBrand[]> => {
  console.log('Using mock brand data');
  return [
    { id: "1", nome: "Acura" },
    { id: "2", nome: "Audi" },
    { id: "3", nome: "BMW" },
    { id: "4", nome: "Chevrolet" },
    { id: "5", nome: "Ford" },
    { id: "6", nome: "Honda" },
    { id: "7", nome: "Hyundai" },
    { id: "8", nome: "Toyota" },
    { id: "9", nome: "Volkswagen" },
  ];
};

export const fetchModelsByBrandMock = async (brandId: string): Promise<VehicleModel[]> => {
  console.log(`Using mock model data for brand ID: ${brandId}`);
  const models: Record<string, VehicleModel[]> = {
    "1": [{ id: "1", nome: "Integra GS 1.8" }, { id: "2", nome: "Legend 3.2/3.5" }, { id: "3", nome: "NSX 3.0" }],
    "2": [{ id: "1", nome: "A3" }, { id: "2", nome: "A4" }, { id: "3", nome: "Q5" }],
    "3": [{ id: "1", nome: "Série 3" }, { id: "2", nome: "Série 5" }, { id: "3", nome: "X5" }],
    "4": [{ id: "1", nome: "Camaro" }, { id: "2", nome: "Onix" }, { id: "3", nome: "Cruze" }],
    "5": [{ id: "1", nome: "Ka" }, { id: "2", nome: "Focus" }, { id: "3", nome: "Fiesta" }],
    "6": [{ id: "1", nome: "Civic" }, { id: "2", nome: "City" }, { id: "3", nome: "Fit" }],
    "7": [{ id: "1", nome: "HB20" }, { id: "2", nome: "Tucson" }, { id: "3", nome: "Creta" }],
    "8": [{ id: "1", nome: "Corolla" }, { id: "2", nome: "Camry" }, { id: "3", nome: "Hilux" }],
    "9": [{ id: "1", nome: "Gol" }, { id: "2", nome: "Polo" }, { id: "3", nome: "T-Cross" }],
  };
  
  return models[brandId] || [];
};

export const fetchYearsByBrandAndModelMock = async (brandId: string, modelId: string): Promise<VehicleYear[]> => {
  console.log(`Using mock year data for brand ID: ${brandId}, model ID: ${modelId}`);
  // Mock data for years
  return [
    { id: "2023-1", nome: "2023 Gasolina" },
    { id: "2022-1", nome: "2022 Gasolina" },
    { id: "2021-1", nome: "2021 Gasolina" },
    { id: "2020-1", nome: "2020 Gasolina" },
    { id: "2019-1", nome: "2019 Gasolina" }
  ];
};

export const fetchPriceByBrandModelYearMock = async (brandId: string, modelId: string, yearId: string): Promise<FipePrice> => {
  console.log(`Using mock price data for brand ID: ${brandId}, model ID: ${modelId}, year ID: ${yearId}`);
  // Mock price data
  const year = parseInt(yearId.split('-')[0]);
  
  // Get brand and model names from their IDs
  let brandName = "Marca";
  const brands = await fetchBrandsMock();
  const brand = brands.find(b => b.id === brandId);
  if (brand) {
    brandName = brand.nome;
  }
  
  let modelName = "Modelo";
  const models = await fetchModelsByBrandMock(brandId);
  const model = models.find(m => m.id === modelId);
  if (model) {
    modelName = model.nome;
  }
  
  return {
    preco: `R$ ${(100000 - ((new Date().getFullYear() - year) * 5000)).toLocaleString('pt-BR')}`,
    combustivel: "Gasolina",
    marca: brandName,
    modelo: modelName,
    anoModelo: year,
    codigoFipe: "999999-9",
    mesReferencia: "maio/2023"
  };
};

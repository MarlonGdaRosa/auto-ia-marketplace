
// API for car brand, model, year information
interface VehicleBrand {
  id: string;
  nome: string;
}

interface VehicleModel {
  id: string;
  nome: string;
}

interface VehicleYear {
  id: string;
  nome: string;
}

interface FipePrice {
  preco: string;
  combustivel: string;
  marca: string;
  modelo: string;
  anoModelo: number;
  codigoFipe?: string;
  mesReferencia?: string;
}

interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
}

// Fetch brands from FIPE API
export const fetchBrands = async (): Promise<VehicleBrand[]> => {
  try {
    console.log('Fetching vehicle brands...');
    const response = await fetch('https://veiculos.fipe.org.br/api/veiculos/ConsultarMarcas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codigoTipoVeiculo: 1, // 1 for cars
        codigoTabelaReferencia: 321, // Reference table
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }
    
    const data = await response.json();
    console.log('Brands data:', data);
    return data.map((brand: any) => ({
      id: brand.Value.toString(),
      nome: brand.Label
    }));
  } catch (error) {
    console.error('Error fetching brands:', error);
    // Fallback to mock data if API call fails
    return fetchBrandsMock();
  }
};

// Fetch models by brand from FIPE API
export const fetchModelsByBrand = async (brandId: string): Promise<VehicleModel[]> => {
  try {
    console.log(`Fetching models for brand ID: ${brandId}...`);
    const response = await fetch('https://veiculos.fipe.org.br/api/veiculos/ConsultarModelos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codigoTipoVeiculo: 1,
        codigoTabelaReferencia: 321,
        codigoMarca: parseInt(brandId),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    
    const data = await response.json();
    console.log('Models data:', data);
    return data.Modelos.map((model: any) => ({
      id: model.Value.toString(),
      nome: model.Label,
    }));
  } catch (error) {
    console.error('Error fetching models:', error);
    // Fallback to mock data if API call fails
    return fetchModelsByBrandMock(brandId);
  }
};

// Fetch years by brand and model from FIPE API
export const fetchYearsByBrandAndModel = async (brandId: string, modelId: string): Promise<VehicleYear[]> => {
  try {
    console.log(`Fetching years for brand ID: ${brandId}, model ID: ${modelId}...`);
    const response = await fetch('https://veiculos.fipe.org.br/api/veiculos/ConsultarAnoModelo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codigoTipoVeiculo: 1,
        codigoTabelaReferencia: 321,
        codigoMarca: parseInt(brandId),
        codigoModelo: parseInt(modelId)
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch years');
    }
    
    const data = await response.json();
    console.log('Years data:', data);
    return data.map((year: any) => ({
      id: year.Value,
      nome: year.Label
    }));
  } catch (error) {
    console.error('Error fetching years:', error);
    // Fallback to mock data if API call fails
    return fetchYearsByBrandAndModelMock(brandId, modelId);
  }
};

// Fetch price by brand, model and year from FIPE API
export const fetchPriceByBrandModelYear = async (brandId: string, modelId: string, yearId: string): Promise<FipePrice> => {
  try {
    console.log(`Fetching price for brand ID: ${brandId}, model ID: ${modelId}, year ID: ${yearId}...`);
    const response = await fetch('https://veiculos.fipe.org.br/api/veiculos/ConsultarValorComTodosParametros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codigoTipoVeiculo: 1,
        codigoTabelaReferencia: 321,
        codigoMarca: parseInt(brandId),
        codigoModelo: parseInt(modelId),
        anoModelo: parseInt(yearId.split('-')[0]),
        codigoTipoCombustivel: parseInt(yearId.split('-')[1]),
        tipoConsulta: "tradicional"
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch price');
    }
    
    const data = await response.json();
    console.log('Price data:', data);
    return {
      preco: data.Valor,
      combustivel: data.Combustivel,
      marca: data.Marca,
      modelo: data.Modelo,
      anoModelo: data.AnoModelo,
      codigoFipe: data.CodigoFipe,
      mesReferencia: data.MesReferencia
    };
  } catch (error) {
    console.error('Error fetching price:', error);
    // Fallback to mock data if API call fails
    return fetchPriceByBrandModelYearMock(brandId, modelId, yearId);
  }
};

// Service to fetch states from IBGE API
export const fetchStates = async (): Promise<IBGEState[]> => {
  try {
    console.log('Fetching states from IBGE API...');
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    
    if (!response.ok) {
      throw new Error('Failed to fetch states');
    }
    
    const data = await response.json();
    console.log('States data:', data);
    return data.map((state: any) => ({
      id: state.id,
      sigla: state.sigla,
      nome: state.nome,
    }));
  } catch (error) {
    console.error('Error fetching states:', error);
    // Return empty array if API call fails
    return [];
  }
};

// Service to fetch cities by state from IBGE API
export const fetchCitiesByState = async (stateId: number): Promise<IBGECity[]> => {
  try {
    console.log(`Fetching cities for state ID: ${stateId}...`);
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios?orderBy=nome`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }
    
    const data = await response.json();
    console.log('Cities data:', data);
    return data.map((city: any) => ({
      id: city.id,
      nome: city.nome,
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    // Return empty array if API call fails
    return [];
  }
};

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

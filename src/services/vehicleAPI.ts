
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

// Fetch brands from FIPE API
export const fetchBrands = async (): Promise<VehicleBrand[]> => {
  try {
    const response = await fetch('https://veiculos.fipe.org.br/api/veiculos/ConsultarMarcas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codigoTipoVeiculo: 1, // 1 for cars
        codigoTabelaReferencia: 321, // This might need updating periodically
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }
    
    const data = await response.json();
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

// Service to fetch states and cities from IBGE API
export const fetchStates = async () => {
  try {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    
    if (!response.ok) {
      throw new Error('Failed to fetch states');
    }
    
    const data = await response.json();
    return data.map((state: any) => ({
      id: state.id,
      sigla: state.sigla,
      nome: state.nome,
    }));
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

export const fetchCitiesByState = async (stateId: number) => {
  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios?orderBy=nome`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }
    
    const data = await response.json();
    return data.map((city: any) => ({
      id: city.id,
      nome: city.nome,
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

// Fallback for local development or when FIPE API is unavailable
export const fetchBrandsMock = async (): Promise<VehicleBrand[]> => {
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
  const models: Record<string, VehicleModel[]> = {
    "1": [{ id: "1", nome: "Integra GS 1.8" }, { id: "2", nome: "Legend 3.2/3.5" }, { id: "3", nome: "NSX 3.0" }],
    "4": [{ id: "1", nome: "Camaro" }, { id: "2", nome: "Onix" }, { id: "3", nome: "Cruze" }],
    "5": [{ id: "1", nome: "Ka" }, { id: "2", nome: "Focus" }, { id: "3", nome: "Fiesta" }],
    "8": [{ id: "1", nome: "Corolla" }, { id: "2", nome: "Camry" }, { id: "3", nome: "Hilux" }],
    "9": [{ id: "1", nome: "Gol" }, { id: "2", nome: "Polo" }, { id: "3", nome: "T-Cross" }],
  };
  
  return models[brandId] || [];
};

export const fetchYearsByBrandAndModelMock = async (brandId: string, modelId: string): Promise<VehicleYear[]> => {
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

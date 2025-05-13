
import { VehicleBrand, VehicleModel, VehicleYear, FipePrice } from './types';
import { fetchBrandsMock, fetchModelsByBrandMock, fetchYearsByBrandAndModelMock, fetchPriceByBrandModelYearMock } from './fipeMocks';

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
      throw new Error(`Failed to fetch brands: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Brands data:', data);
    
    // Verify data is an array before mapping
    if (!Array.isArray(data)) {
      console.error('Unexpected response format for brands:', data);
      throw new Error('API returned unexpected data format for brands');
    }
    
    return data.map((brand: any) => ({
      id: brand.Value.toString(),
      nome: brand.Label
    }));
  } catch (error) {
    console.error('Error fetching brands:', error);
    // Fallback to mock data if API call fails
    console.log('Falling back to mock data for brands');
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
      throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Models data:', data);
    
    // Check if the response has the expected structure
    if (!data.Modelos || !Array.isArray(data.Modelos)) {
      console.error('Unexpected response format for models:', data);
      throw new Error('API returned unexpected data format for models');
    }
    
    return data.Modelos.map((model: any) => ({
      id: model.Value.toString(),
      nome: model.Label,
    }));
  } catch (error) {
    console.error('Error fetching models:', error);
    // Fallback to mock data if API call fails
    console.log('Falling back to mock data for models');
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
      throw new Error(`Failed to fetch years: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Years data:', data);
    
    // Check if the response is an array
    if (!Array.isArray(data)) {
      console.error('Unexpected response format for years:', data);
      throw new Error('API returned unexpected data format for years');
    }
    
    return data.map((year: any) => ({
      id: year.Value,
      nome: year.Label
    }));
  } catch (error) {
    console.error('Error fetching years:', error);
    // Fallback to mock data if API call fails
    console.log('Falling back to mock data for years');
    return fetchYearsByBrandAndModelMock(brandId, modelId);
  }
};

// Fetch price by brand, model and year from FIPE API
export const fetchPriceByBrandModelYear = async (brandId: string, modelId: string, yearId: string): Promise<FipePrice> => {
  try {
    console.log(`Fetching price for brand ID: ${brandId}, model ID: ${modelId}, year ID: ${yearId}...`);
    const yearParts = yearId.split('-');
    if (yearParts.length !== 2) {
      throw new Error(`Invalid year ID format: ${yearId}`);
    }
    
    const year = parseInt(yearParts[0]);
    const fuelCode = parseInt(yearParts[1]);
    
    if (isNaN(year) || isNaN(fuelCode)) {
      throw new Error(`Invalid year or fuel code: ${yearId}`);
    }
    
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
        anoModelo: year,
        codigoTipoCombustivel: fuelCode,
        tipoVeiculo: "carro",
        tipoConsulta: "tradicional"
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch price: ${response.status} ${response.statusText}`);
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
    console.log('Falling back to mock data for price');
    return fetchPriceByBrandModelYearMock(brandId, modelId, yearId);
  }
};

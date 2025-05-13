
// API for car brand, model, year information

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

// API for vehicle information
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

interface VehiclePrice {
  preco: string;
  combustivel: string;
}

// Fetch brands
export const fetchBrands = async (): Promise<VehicleBrand[]> => {
  try {
    const response = await fetch('https://lij0gcrul0.apidog.io/marcas');
    
    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
};

// Fetch models by brand
export const fetchModelsByBrand = async (brandId: string): Promise<VehicleModel[]> => {
  try {
    const response = await fetch(`https://lij0gcrul0.apidog.io/modelos/${brandId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
};

// Fetch years by brand and model
export const fetchYearsByBrandAndModel = async (brandId: string, modelId: string): Promise<VehicleYear[]> => {
  try {
    const response = await fetch(`https://lij0gcrul0.apidog.io/anos/${brandId}/${modelId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch years');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching years:', error);
    return [];
  }
};

// Fetch price by brand, model and year
export const fetchPriceByBrandModelYear = async (
  brandId: string, 
  modelId: string, 
  yearId: string
): Promise<VehiclePrice | null> => {
  try {
    const response = await fetch(`https://lij0gcrul0.apidog.io/preco/${brandId}/${modelId}/${yearId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch price');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching price:', error);
    return null;
  }
};

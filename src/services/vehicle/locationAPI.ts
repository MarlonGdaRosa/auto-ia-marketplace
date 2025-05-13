
import { IBGEState, IBGECity } from './types';

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

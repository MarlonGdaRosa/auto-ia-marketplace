
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

// These are the functions that will be exported as getStates and getCities
export const getStates = fetchStates;
export const getCities = async (stateId: number | string): Promise<IBGECity[]> => {
  // If stateId is provided as a string (state code), we need to find the corresponding ID
  if (typeof stateId === 'string') {
    const states = await fetchStates();
    const state = states.find(s => s.sigla === stateId);
    if (!state) return [];
    return fetchCitiesByState(state.id);
  }
  return fetchCitiesByState(stateId);
};

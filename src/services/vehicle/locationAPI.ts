
import axios from 'axios';
import { IBGEState, IBGECity } from './types';

export const getStates = async (): Promise<IBGEState[]> => {
  try {
    const response = await axios.get<IBGEState[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    return response.data;
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

export const getCities = async (stateId: number | string): Promise<IBGECity[]> => {
  try {
    const response = await axios.get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios?orderBy=nome`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cities for state ${stateId}:`, error);
    return [];
  }
};

// We'll also provide alias functions for backward compatibility
export const fetchStates = getStates;
export const fetchCitiesByState = getCities;

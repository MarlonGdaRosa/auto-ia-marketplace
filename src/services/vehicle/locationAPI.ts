import axios from 'axios';

interface State {
  sigla: string;
  nome: string;
}

interface City {
  nome: string;
}

export const getStates = async (): Promise<State[]> => {
  try {
    const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    return response.data;
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

export const getCities = async (stateCode: string): Promise<City[]> => {
  try {
    const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios?orderBy=nome`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cities for state ${stateCode}:`, error);
    return [];
  }
};

// Export any other location-related functions or data here

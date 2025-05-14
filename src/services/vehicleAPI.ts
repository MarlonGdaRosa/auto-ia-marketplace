
import { getStates, getCities, fetchStates, fetchCitiesByState } from './vehicle/locationAPI';
import { 
  getBrands, 
  getModels, 
  getYears, 
  getVehicleInfo 
} from './vehicle/fipeAPI';

// Re-export everything for easier imports
export {
  getStates,
  getCities,
  getBrands,
  getModels,
  getYears,
  getVehicleInfo,
  
  // Compatibility layer
  fetchStates,
  fetchCitiesByState
};

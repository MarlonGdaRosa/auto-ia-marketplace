
import { getStates, getCities, fetchStates, fetchCitiesByState } from './vehicle/locationAPI';
import { 
  getBrands as getFipeBrands, 
  getModels as getFipeModels, 
  getYears as getFipeYears, 
  getVehicleInfo as getFipeInfo
} from './vehicle/fipeAPI';

// Re-export everything for easier imports
export {
  getStates,
  getCities,
  getFipeBrands,
  getFipeModels,
  getFipeYears,
  getFipeInfo,
  
  // Compatibility layer
  fetchStates,
  fetchCitiesByState
};

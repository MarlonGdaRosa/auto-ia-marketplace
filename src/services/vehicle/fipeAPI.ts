
import axios from 'axios';
import { VehicleBrand, VehicleModel, VehicleYear, FipePrice } from './types';

// Base URL for FIPE API
const FIPE_API_URL = 'https://parallelum.com.br/fipe/api/v1';

/**
 * Get vehicle brands from FIPE API
 * @param vehicleType - Type of vehicle (carros, motos, caminhoes)
 */
export const getBrands = async (vehicleType = 'carros'): Promise<VehicleBrand[]> => {
  try {
    const response = await axios.get(`${FIPE_API_URL}/${vehicleType}/marcas`);
    return response.data;
  } catch (error) {
    console.error('Error fetching FIPE brands:', error);
    return [];
  }
};

/**
 * Get vehicle models from FIPE API by brand ID
 * @param brandId - The brand ID
 * @param vehicleType - Type of vehicle (carros, motos, caminhoes)
 */
export const getModels = async (brandId: string, vehicleType = 'carros'): Promise<VehicleModel[]> => {
  try {
    console.log(`Fetching models for brand ID: ${brandId}`);
    const response = await axios.get(`${FIPE_API_URL}/${vehicleType}/marcas/${brandId}/modelos`);
    console.log('Models API response:', response.data);
    return response.data.modelos || [];
  } catch (error) {
    console.error(`Error fetching models for brand ${brandId}:`, error);
    return [];
  }
};

/**
 * Get vehicle years from FIPE API by brand and model ID
 * @param brandId - The brand ID
 * @param modelId - The model ID
 * @param vehicleType - Type of vehicle (carros, motos, caminhoes)
 */
export const getYears = async (
  brandId: string,
  modelId: string,
  vehicleType = 'carros'
): Promise<VehicleYear[]> => {
  try {
    const response = await axios.get(
      `${FIPE_API_URL}/${vehicleType}/marcas/${brandId}/modelos/${modelId}/anos`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching years for model ${modelId}:`, error);
    return [];
  }
};

/**
 * Get vehicle detailed information from FIPE API
 * @param brandId - The brand ID
 * @param modelId - The model ID
 * @param yearId - The year ID (code)
 * @param vehicleType - Type of vehicle (carros, motos, caminhoes)
 */
export const getVehicleInfo = async (
  brandId: string,
  modelId: string,
  yearId: string,
  vehicleType = 'carros'
): Promise<FipePrice | null> => {
  try {
    const response = await axios.get(
      `${FIPE_API_URL}/${vehicleType}/marcas/${brandId}/modelos/${modelId}/anos/${yearId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching info for vehicle ${modelId}, year ${yearId}:`, error);
    return null;
  }
};

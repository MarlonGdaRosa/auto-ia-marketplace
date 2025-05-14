
export * from './types';
export * from './fipeAPI';
export * from './locationAPI';
export * from './fipeMocks';

// Ensure these aliases are exported to maintain compatibility
export { 
  getBrands as fetchBrands,
  getModels as fetchModelsByBrand,
  getYears as fetchYearsByBrandAndModel,
  getVehicleInfo as fetchPriceByBrandModelYear
} from './fipeAPI';

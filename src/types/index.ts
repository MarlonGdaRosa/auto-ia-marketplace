
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel: string;
  location: {
    state: string;
    city: string;
    region: string;
  };
  features: string[];
  description: string;
  images: string[];
  status: string;
  seller_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Seller {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  state: string;
  created_at?: string;
}

export interface Proposal {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  vehicle_id: string;
  status?: string;
  created_at?: string;
  vehicle?: {
    id: string;
    brand: string;
    model: string;
    year: number;
  };
}

export interface DashboardStats {
  totalVehicles: number;
  soldVehicles: number;
  reservedVehicles: number;
  totalProposals: number;
  pendingProposals: number;
  contactedProposals: number;
  closedProposals: number;
  topBrand: {
    name: string;
    count: number;
  };
  newProposals: number;
}

// Adding the missing FilterOptions interface
export interface FilterOptions {
  brand?: string;
  model?: string;
  state?: string;
  city?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  transmission?: string;
  fuel?: string[];
  search?: string;
}

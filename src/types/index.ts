
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: "manual" | "automatic";
  fuel: "gasoline" | "ethanol" | "diesel" | "electric" | "hybrid" | "flex";
  location: {
    state: string;
    city: string;
    region?: string;
  };
  features: string[];
  description: string;
  images: string[];
  status: "available" | "sold" | "reserved";
  createdAt: string;
  updatedAt: string;
  sellerId?: string;
}

export interface Seller {
  id: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  email?: string;
  createdAt: string;
}

export interface Proposal {
  id: string;
  vehicleId: string;
  vehicleInfo: {
    brand: string;
    model: string;
    year: number;
  };
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "pending" | "contacted" | "closed";
  createdAt: string;
}

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
  transmission?: "manual" | "automatic";
  fuel?: string[];
  search?: string;
}

export interface DashboardStats {
  totalVehicles: number;
  soldVehicles: number;
  reservedVehicles: number;
  totalProposals: number;
  pendingProposals: number;
  contactedProposals: number;
  closedProposals: number;
  totalSold: number;
  topBrand: {
    name: string;
    count: number;
  };
  newProposals: number;
}

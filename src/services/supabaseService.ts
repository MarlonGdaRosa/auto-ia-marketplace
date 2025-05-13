
import { supabase } from "@/integrations/supabase/client";
import { Vehicle, Seller, Proposal, DashboardStats, FilterOptions } from "@/types";

export const getVehicles = async (filters?: FilterOptions): Promise<Vehicle[]> => {
  let query = supabase
    .from('vehicles')
    .select('*, sellers(name, phone, email, city, state)');

  // Apply filters if provided
  if (filters) {
    if (filters.brand) {
      query = query.eq('brand', filters.brand);
    }
    
    if (filters.model) {
      query = query.ilike('model', `%${filters.model}%`);
    }
    
    if (filters.state && filters.state !== "") {
      query = query.eq('location->state', filters.state);
    }
    
    if (filters.city && filters.city !== "") {
      query = query.eq('location->city', filters.city);
    }
    
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }
    
    if (filters.minYear !== undefined) {
      query = query.gte('year', filters.minYear);
    }
    
    if (filters.maxYear !== undefined) {
      query = query.lte('year', filters.maxYear);
    }
    
    if (filters.transmission) {
      query = query.eq('transmission', filters.transmission);
    }
    
    if (filters.fuel && filters.fuel.length > 0) {
      query = query.in('fuel', filters.fuel);
    }
    
    if (filters.search) {
      query = query.or(`brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%`);
    }
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
  
  // Transform the data to match our Vehicle type
  return data.map(item => ({
    id: item.id,
    brand: item.brand,
    model: item.model,
    year: item.year,
    price: item.price,
    mileage: item.mileage,
    transmission: item.transmission,
    fuel: item.fuel,
    location: item.location,
    features: item.features,
    description: item.description,
    images: item.images,
    status: item.status,
    sellerId: item.seller_id,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    sellers: item.sellers
  })) as Vehicle[];
};

export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*, sellers(*)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching vehicle:", error);
    return null;
  }
  
  // Transform the data to match our Vehicle type
  if (!data) return null;
  
  return {
    id: data.id,
    brand: data.brand,
    model: data.model,
    year: data.year,
    price: data.price,
    mileage: data.mileage,
    transmission: data.transmission,
    fuel: data.fuel,
    location: data.location,
    features: data.features,
    description: data.description,
    images: data.images,
    status: data.status,
    sellerId: data.seller_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    sellers: data.sellers
  } as Vehicle;
};

export const getSellers = async (): Promise<Seller[]> => {
  const { data, error } = await supabase
    .from('sellers')
    .select('*');
  
  if (error) {
    console.error("Error fetching sellers:", error);
    return [];
  }
  
  // Transform the data to match our Seller type
  return data.map(item => ({
    id: item.id,
    name: item.name,
    phone: item.phone,
    city: item.city,
    state: item.state,
    email: item.email || '',
    createdAt: item.created_at
  })) as Seller[];
};

export const getSellerById = async (id: string): Promise<Seller | null> => {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching seller:", error);
    return null;
  }
  
  // Transform the data to match our Seller type
  if (!data) return null;
  
  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    city: data.city,
    state: data.state,
    email: data.email || '',
    createdAt: data.created_at
  } as Seller;
};

export const getProposals = async (): Promise<Proposal[]> => {
  const { data, error } = await supabase
    .from('proposals')
    .select('*, vehicles(brand, model, year)')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching proposals:", error);
    return [];
  }
  
  // Transform the data to match our Proposal type
  return data.map(item => ({
    id: item.id,
    vehicleId: item.vehicle_id,
    vehicleInfo: {
      brand: item.vehicles.brand,
      model: item.vehicles.model,
      year: item.vehicles.year
    },
    name: item.name,
    email: item.email,
    phone: item.phone,
    message: item.message,
    status: item.status as "pending" | "contacted" | "closed",
    createdAt: item.created_at
  })) as Proposal[];
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Get total vehicles
  const { count: totalVehicles } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true });
  
  // Get sold vehicles
  const { count: totalSold } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'sold');
  
  // Get pending proposals
  const { count: newProposals } = await supabase
    .from('proposals')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
  
  // Get top brand
  const { data: brands } = await supabase
    .from('vehicles')
    .select('brand');
  
  // Count occurrences of each brand
  const brandCounts: Record<string, number> = {};
  brands?.forEach(item => {
    const brand = item.brand;
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
  });
  
  // Find the brand with the highest count
  let topBrandName = "";
  let topBrandCount = 0;
  
  Object.entries(brandCounts).forEach(([brand, count]) => {
    if (count > topBrandCount) {
      topBrandName = brand;
      topBrandCount = count;
    }
  });
  
  return {
    totalVehicles: totalVehicles || 0,
    totalSold: totalSold || 0,
    newProposals: newProposals || 0,
    topBrand: {
      name: topBrandName || "N/A",
      count: topBrandCount
    }
  };
};

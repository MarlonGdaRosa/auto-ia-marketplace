
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
  
  return data as Vehicle[];
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
  
  return data as Vehicle;
};

export const getSellers = async (): Promise<Seller[]> => {
  const { data, error } = await supabase
    .from('sellers')
    .select('*');
  
  if (error) {
    console.error("Error fetching sellers:", error);
    return [];
  }
  
  return data as Seller[];
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
  
  return data as Seller;
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
    ...item,
    vehicleId: item.vehicle_id,
    vehicleInfo: {
      brand: item.vehicles.brand,
      model: item.vehicles.model,
      year: item.vehicles.year
    }
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


import { supabase } from "@/integrations/supabase/client";
import { Vehicle, Seller, Proposal, DashboardStats, FilterOptions } from "@/types";
import { Json } from "@/integrations/supabase/types";

// Vehicle services
export const getVehicles = async (filters?: FilterOptions): Promise<Vehicle[]> => {
  try {
    let query = supabase
      .from("vehicles")
      .select("*");

    // Apply filters if they exist
    if (filters) {
      if (filters.brand) {
        query = query.eq("brand", filters.brand);
      }
      
      if (filters.model) {
        query = query.ilike("model", `%${filters.model}%`);
      }
      
      if (filters.state && filters.state !== 'all') {
        query = query.eq("location->state", filters.state);
      }
      
      if (filters.city && filters.city !== 'all') {
        query = query.eq("location->city", filters.city);
      }
      
      if (filters.region) {
        query = query.eq("location->region", filters.region);
      }
      
      if (filters.minPrice !== undefined) {
        query = query.gte("price", filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined) {
        query = query.lte("price", filters.maxPrice);
      }
      
      if (filters.minYear !== undefined) {
        query = query.gte("year", filters.minYear);
      }
      
      if (filters.maxYear !== undefined) {
        query = query.lte("year", filters.maxYear);
      }
      
      if (filters.transmission) {
        query = query.eq("transmission", filters.transmission);
      }
      
      if (filters.fuel && filters.fuel.length > 0) {
        query = query.in("fuel", filters.fuel);
      }
      
      if (filters.search) {
        query = query.or(`brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%`);
      }
    }

    // Add order by created_at
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching vehicles:", error);
      return [];
    }

    // Transform data to match the Vehicle interface
    return data.map(vehicle => ({
      ...vehicle,
      location: vehicle.location as { state: string; city: string; region: string }
    })) as Vehicle[];
  } catch (error) {
    console.error("Error in getVehicles:", error);
    return [];
  }
};

export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching vehicle by ID:", error);
      return null;
    }

    // Transform data to match the Vehicle interface
    return {
      ...data,
      location: data.location as { state: string; city: string; region: string }
    } as Vehicle;
  } catch (error) {
    console.error("Error in getVehicleById:", error);
    return null;
  }
};

export const createVehicle = async (vehicleData: Partial<Vehicle>): Promise<Vehicle | null> => {
  try {
    // Transform the vehicle data to match the database schema
    const dbVehicle = {
      brand: vehicleData.brand || '',
      model: vehicleData.model || '',
      year: vehicleData.year || 0,
      price: vehicleData.price || 0,
      mileage: vehicleData.mileage || 0,
      transmission: vehicleData.transmission || '',
      fuel: vehicleData.fuel || '',
      location: vehicleData.location || { state: '', city: '', region: '' },
      features: vehicleData.features || [],
      description: vehicleData.description || '',
      images: vehicleData.images || [],
      status: vehicleData.status || 'available',
      seller_id: vehicleData.seller_id
    };

    const { data, error } = await supabase
      .from("vehicles")
      .insert(dbVehicle)
      .select()
      .single();

    if (error) {
      console.error("Error creating vehicle:", error);
      return null;
    }

    // Transform response to match the Vehicle interface
    return {
      ...data,
      location: data.location as { state: string; city: string; region: string }
    } as Vehicle;
  } catch (error) {
    console.error("Error in createVehicle:", error);
    return null;
  }
};

export const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle | null> => {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .update(vehicleData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating vehicle:", error);
      return null;
    }

    // Transform response to match the Vehicle interface
    return {
      ...data,
      location: data.location as { state: string; city: string; region: string }
    } as Vehicle;
  } catch (error) {
    console.error("Error in updateVehicle:", error);
    return null;
  }
};

export const deleteVehicle = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting vehicle:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteVehicle:", error);
    return false;
  }
};

// Seller services
export const getSellers = async (): Promise<Seller[]> => {
  try {
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching sellers:", error);
      return [];
    }

    return data as Seller[];
  } catch (error) {
    console.error("Error in getSellers:", error);
    return [];
  }
};

export const getSellerById = async (id: string): Promise<Seller | null> => {
  try {
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching seller by ID:", error);
      return null;
    }

    return data as Seller;
  } catch (error) {
    console.error("Error in getSellerById:", error);
    return null;
  }
};

// Proposal services
export const createProposal = async (proposalData: {
  name: string;
  email: string;
  phone: string;
  message: string;
  vehicle_id: string;
}): Promise<boolean> => {
  try {
    // Insert the proposal into the database
    const { data, error } = await supabase
      .from("proposals")
      .insert({
        ...proposalData,
        status: "pending"
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating proposal:", error);
      return false;
    }

    // Trigger the edge function to send notification email
    try {
      const response = await fetch('https://wctgmidvzjpvuocmqvfz.supabase.co/functions/v1/send-proposal-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY || ''}`
        },
        body: JSON.stringify({
          proposal_id: data.id
        })
      });

      if (!response.ok) {
        console.warn('Failed to trigger notification, but proposal was created');
      }
    } catch (notificationError) {
      console.warn('Error sending notification, but proposal was created:', notificationError);
    }

    return true;
  } catch (error) {
    console.error("Error in createProposal:", error);
    return false;
  }
};

export const getProposals = async (): Promise<Proposal[]> => {
  try {
    const { data, error } = await supabase
      .from("proposals")
      .select("*, vehicle:vehicle_id(id, brand, model, year)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching proposals:", error);
      return [];
    }

    return data as Proposal[];
  } catch (error) {
    console.error("Error in getProposals:", error);
    return [];
  }
};

export const getProposalById = async (id: string): Promise<Proposal | null> => {
  try {
    const { data, error } = await supabase
      .from("proposals")
      .select("*, vehicle:vehicle_id(id, brand, model, year)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching proposal by ID:", error);
      return null;
    }

    return data as Proposal;
  } catch (error) {
    console.error("Error in getProposalById:", error);
    return null;
  }
};

export const updateProposalStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("proposals")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating proposal status:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateProposalStatus:", error);
    return false;
  }
};

// Dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get counts for vehicles by status
    const { data: availableVehicles, error: availableError } = await supabase
      .from("vehicles")
      .select("id", { count: 'exact' })
      .eq("status", "available");

    const { data: soldVehicles, error: soldError } = await supabase
      .from("vehicles")
      .select("id", { count: 'exact' })
      .eq("status", "sold");

    const { data: reservedVehicles, error: reservedError } = await supabase
      .from("vehicles")
      .select("id", { count: 'exact' })
      .eq("status", "reserved");

    // Get counts for proposals by status
    const { data: pendingProposals, error: pendingError } = await supabase
      .from("proposals")
      .select("id", { count: 'exact' })
      .eq("status", "pending");

    const { data: contactedProposals, error: contactedError } = await supabase
      .from("proposals")
      .select("id", { count: 'exact' })
      .eq("status", "contacted");

    const { data: closedProposals, error: closedError } = await supabase
      .from("proposals")
      .select("id", { count: 'exact' })
      .eq("status", "closed");

    // Get all vehicles to determine top brand
    const { data: vehicles, error: vehiclesError } = await supabase
      .from("vehicles")
      .select("brand");

    if (vehiclesError) {
      console.error("Error fetching vehicles for stats:", vehiclesError);
    }

    // Count occurrences of each brand
    const brandCounts: Record<string, number> = {};
    vehicles?.forEach(vehicle => {
      brandCounts[vehicle.brand] = (brandCounts[vehicle.brand] || 0) + 1;
    });

    // Find the brand with the most vehicles
    let topBrandName = "";
    let topBrandCount = 0;

    Object.entries(brandCounts).forEach(([brand, count]) => {
      if (count > topBrandCount) {
        topBrandName = brand;
        topBrandCount = count;
      }
    });

    const totalVehicles = (availableVehicles?.length || 0) + 
                         (soldVehicles?.length || 0) + 
                         (reservedVehicles?.length || 0);

    const totalProposals = (pendingProposals?.length || 0) + 
                          (contactedProposals?.length || 0) + 
                          (closedProposals?.length || 0);

    return {
      totalVehicles: totalVehicles,
      soldVehicles: soldVehicles?.length || 0,
      reservedVehicles: reservedVehicles?.length || 0,
      totalProposals: totalProposals,
      pendingProposals: pendingProposals?.length || 0,
      contactedProposals: contactedProposals?.length || 0,
      closedProposals: closedProposals?.length || 0,
      topBrand: {
        name: topBrandName,
        count: topBrandCount
      },
      newProposals: pendingProposals?.length || 0
    };

  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    
    // Return default values in case of error
    return {
      totalVehicles: 0,
      soldVehicles: 0,
      reservedVehicles: 0,
      totalProposals: 0,
      pendingProposals: 0,
      contactedProposals: 0,
      closedProposals: 0,
      topBrand: {
        name: "",
        count: 0
      },
      newProposals: 0
    };
  }
};

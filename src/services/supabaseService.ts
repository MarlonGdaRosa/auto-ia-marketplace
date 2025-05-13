
import { supabase } from "@/integrations/supabase/client";
import { Vehicle, Seller, Proposal, DashboardStats } from "@/types";

// Vehicle services
export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching vehicles:", error);
      return [];
    }

    return data as Vehicle[];
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

    return data as Vehicle;
  } catch (error) {
    console.error("Error in getVehicleById:", error);
    return null;
  }
};

export const createVehicle = async (vehicle: Partial<Vehicle>): Promise<Vehicle | null> => {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .insert(vehicle)
      .select()
      .single();

    if (error) {
      console.error("Error creating vehicle:", error);
      return null;
    }

    return data as Vehicle;
  } catch (error) {
    console.error("Error in createVehicle:", error);
    return null;
  }
};

export const updateVehicle = async (id: string, vehicle: Partial<Vehicle>): Promise<Vehicle | null> => {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .update(vehicle)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating vehicle:", error);
      return null;
    }

    return data as Vehicle;
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
    const { data: vehicleCounts, error: vehicleError } = await supabase
      .from("vehicles")
      .select("status", { count: 'exact' })
      .in("status", ["available", "sold", "reserved"]);

    if (vehicleError) {
      console.error("Error fetching vehicle counts:", vehicleError);
    }

    const totalVehicles = vehicleCounts?.length || 0;
    const soldVehicles = vehicleCounts?.filter(v => v.status === "sold").length || 0;
    const reservedVehicles = vehicleCounts?.filter(v => v.status === "reserved").length || 0;

    // Get counts for proposals by status
    const { data: proposalCounts, error: proposalError } = await supabase
      .from("proposals")
      .select("status", { count: 'exact' })
      .in("status", ["pending", "contacted", "closed"]);

    if (proposalError) {
      console.error("Error fetching proposal counts:", proposalError);
    }

    const totalProposals = proposalCounts?.length || 0;
    const pendingProposals = proposalCounts?.filter(p => p.status === "pending").length || 0;
    const contactedProposals = proposalCounts?.filter(p => p.status === "contacted").length || 0;
    const closedProposals = proposalCounts?.filter(p => p.status === "closed").length || 0;

    // Get top brand
    const { data: brands, error: brandsError } = await supabase
      .from("vehicles")
      .select("brand");

    if (brandsError) {
      console.error("Error fetching brands:", brandsError);
    }

    // Count occurrences of each brand
    const brandCounts: Record<string, number> = {};
    brands?.forEach(vehicle => {
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

    return {
      totalVehicles,
      soldVehicles,
      reservedVehicles,
      totalProposals,
      pendingProposals,
      contactedProposals,
      closedProposals,
      topBrand: {
        name: topBrandName,
        count: topBrandCount
      },
      newProposals: pendingProposals
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


import { supabase } from "@/integrations/supabase/client";
import { Vehicle, Seller, Proposal, DashboardStats } from "@/types";

export const getVehicles = async (filters?: any): Promise<Vehicle[]> => {
  try {
    let query = supabase
      .from("vehicles")
      .select("*, sellers(name, phone)");

    if (filters?.brand) {
      query = query.eq("brand", filters.brand);
    }

    // Add more filters as needed

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }

    return data.map((item: any) => ({
      id: item.id,
      brand: item.brand,
      model: item.model,
      year: item.year,
      price: item.price,
      mileage: item.mileage,
      transmission: item.transmission as "manual" | "automatic",
      fuel: item.fuel as "gasoline" | "ethanol" | "diesel" | "electric" | "hybrid" | "flex",
      location: item.location as { state: string; city: string; region?: string },
      features: item.features,
      description: item.description,
      images: item.images,
      status: item.status as "available" | "sold" | "reserved",
      sellerId: item.seller_id,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error("Error in getVehicles:", error);
    return [];
  }
};

export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*, sellers(name, phone)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching vehicle:", error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      brand: data.brand,
      model: data.model,
      year: data.year,
      price: data.price,
      mileage: data.mileage,
      transmission: data.transmission as "manual" | "automatic",
      fuel: data.fuel as "gasoline" | "ethanol" | "diesel" | "electric" | "hybrid" | "flex",
      location: data.location as { state: string; city: string; region?: string },
      features: data.features,
      description: data.description,
      images: data.images,
      status: data.status as "available" | "sold" | "reserved",
      sellerId: data.seller_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Error in getVehicleById:", error);
    return null;
  }
};

export const getSellers = async (): Promise<Seller[]> => {
  try {
    const { data, error } = await supabase
      .from("sellers")
      .select("*");

    if (error) {
      console.error("Error fetching sellers:", error);
      throw error;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      phone: item.phone,
      city: item.city,
      state: item.state,
      email: item.email || '',
      createdAt: item.created_at
    }));
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
      console.error("Error fetching seller:", error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      city: data.city,
      state: data.state,
      email: data.email || '',
      createdAt: data.created_at
    };
  } catch (error) {
    console.error("Error in getSellerById:", error);
    return null;
  }
};

export const getProposals = async (): Promise<Proposal[]> => {
  try {
    const { data, error } = await supabase
      .from("proposals")
      .select("*, vehicle:vehicle_id(brand, model, year)");

    if (error) {
      console.error("Error fetching proposals:", error);
      throw error;
    }

    return data.map((item: any) => ({
      id: item.id,
      vehicleId: item.vehicle_id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      vehicleInfo: {
        brand: item.vehicle?.brand || "",
        model: item.vehicle?.model || "",
        year: item.vehicle?.year || 0
      },
      message: item.message,
      status: item.status as "pending" | "contacted" | "closed",
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error("Error in getProposals:", error);
    return [];
  }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get total vehicles
    const { count: totalVehicles, error: vehicleError } = await supabase
      .from("vehicles")
      .select("*", { count: "exact", head: true });

    // Get vehicle status counts
    const { data: statusCounts, error: statusError } = await supabase
      .from("vehicles")
      .select("status")
      .then(({ data }) => {
        const counts = { available: 0, sold: 0, reserved: 0 };
        data?.forEach((item) => {
          if (item.status === "available") counts.available++;
          if (item.status === "sold") counts.sold++;
          if (item.status === "reserved") counts.reserved++;
        });
        return { data: counts, error: null };
      });

    // Get total proposals
    const { count: totalProposals, error: proposalError } = await supabase
      .from("proposals")
      .select("*", { count: "exact", head: true });

    // Get proposal status counts
    const { data: proposalStatusCounts, error: proposalStatusError } = await supabase
      .from("proposals")
      .select("status")
      .then(({ data }) => {
        const counts = { pending: 0, contacted: 0, closed: 0 };
        data?.forEach((item) => {
          if (item.status === "pending") counts.pending++;
          if (item.status === "contacted") counts.contacted++;
          if (item.status === "closed") counts.closed++;
        });
        return { data: counts, error: null };
      });

    if (vehicleError || statusError || proposalError || proposalStatusError) {
      console.error("Error fetching dashboard stats:", 
        vehicleError || statusError || proposalError || proposalStatusError);
      throw vehicleError || statusError || proposalError || proposalStatusError;
    }

    return {
      totalVehicles: totalVehicles || 0,
      availableVehicles: statusCounts?.available || 0,
      soldVehicles: statusCounts?.sold || 0,
      reservedVehicles: statusCounts?.reserved || 0,
      totalProposals: totalProposals || 0,
      pendingProposals: proposalStatusCounts?.pending || 0,
      contactedProposals: proposalStatusCounts?.contacted || 0,
      closedProposals: proposalStatusCounts?.closed || 0
    };
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return {
      totalVehicles: 0,
      availableVehicles: 0,
      soldVehicles: 0,
      reservedVehicles: 0,
      totalProposals: 0,
      pendingProposals: 0,
      contactedProposals: 0,
      closedProposals: 0
    };
  }
};

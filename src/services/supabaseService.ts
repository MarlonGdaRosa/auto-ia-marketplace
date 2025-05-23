
import { supabase } from '@/integrations/supabase/client';
import { Vehicle, Seller, Proposal } from '@/types';
import { toast } from 'sonner';

// Helper function to generate UUID in browser environment
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Vehicle Services
export const getVehicles = async (filters?: any) => {
  try {
    let query = supabase.from('vehicles').select('*');

    if (filters) {
      // Apply filters
      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        query = query.or(`brand.ilike.${searchTerm},model.ilike.${searchTerm}`);
      }
      if (filters.brand) {
        query = query.eq('brand', filters.brand);
      }
      if (filters.model) {
        query = query.eq('model', filters.model);
      }
      if (filters.state && filters.state !== 'all') {
        query = query.filter('location->state', 'eq', filters.state);
      }
      if (filters.city && filters.city !== 'all') {
        query = query.filter('location->city', 'eq', filters.city);
      }
      if (filters.minYear) {
        query = query.gte('year', filters.minYear);
      }
      if (filters.maxYear) {
        query = query.lte('year', filters.maxYear);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.transmission) {
        query = query.eq('transmission', filters.transmission);
      }
      if (filters.fuel && filters.fuel.length > 0) {
        query = query.in('fuel', filters.fuel);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as Vehicle[];
  } catch (error: any) {
    console.error('Error fetching vehicles:', error);
    toast.error(`Erro ao carregar veículos: ${error.message || 'Tente novamente'}`);
    return [];
  }
}

export const getVehicleById = async (id: string) => {
  try {
    console.log('Fetching vehicle by ID:', id);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) throw error;
    
    if (!data) {
      console.log('No vehicle found with ID:', id);
      toast.error('Veículo não encontrado');
      return null;
    }
    
    console.log('Vehicle data retrieved:', data);
    return data as Vehicle;
  } catch (error: any) {
    console.error('Error in getVehicleById:', error);
    toast.error(`Erro ao buscar veículo: ${error.message || 'Tente novamente'}`);
    return null;
  }
}

export const createVehicle = async (vehicleData: Partial<Vehicle>) => {
  try {
    // Ensure required fields are present with default values if needed
    const dbVehicle = {
      brand: vehicleData.brand || '',
      model: vehicleData.model || '',
      year: vehicleData.year || new Date().getFullYear(),
      price: vehicleData.price || 0,
      mileage: vehicleData.mileage || 0,
      transmission: vehicleData.transmission || 'manual',
      fuel: vehicleData.fuel || 'flex',
      location: vehicleData.location || { state: '', city: '', region: '' },
      features: vehicleData.features || [],
      description: vehicleData.description || '',
      images: vehicleData.images || [],
      status: vehicleData.status || 'available',
      seller_id: vehicleData.seller_id
    };
    
    const { data, error } = await supabase
      .from('vehicles')
      .insert(dbVehicle)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success(`${data.brand} ${data.model} cadastrado com sucesso!`);
    return data as Vehicle;
  } catch (error: any) {
    console.error('Error creating vehicle:', error);
    toast.error(`Erro ao cadastrar veículo: ${error.message || 'Tente novamente'}`);
    throw error;
  }
}

export const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
  try {
    // We don't need to provide all fields when updating
    const dbVehicle = {
      ...vehicleData,
      seller_id: vehicleData.seller_id,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('vehicles')
      .update(dbVehicle)
      .eq('id', id)
      .select()
      .maybeSingle();
      
    if (error) throw error;
    
    if (!data) {
      throw new Error('Veículo não encontrado após atualização');
    }
    
    toast.success(`${data.brand} ${data.model} atualizado com sucesso!`);
    return data as Vehicle;
  } catch (error: any) {
    console.error('Error updating vehicle:', error);
    toast.error(`Erro ao atualizar veículo: ${error.message || 'Tente novamente'}`);
    throw error;
  }
}

export const deleteVehicle = async (id: string) => {
  try {
    console.log('Deleting vehicle with ID:', id);
    
    // Verifique primeiro se o veículo existe
    const { data: existingVehicle, error: checkError } = await supabase
      .from('vehicles')
      .select('id')
      .eq('id', id)
      .single();
      
    if (checkError) {
      console.error('Error checking if vehicle exists:', checkError);
      throw new Error(`Veículo não encontrado: ${checkError.message}`);
    }
    
    if (!existingVehicle) {
      throw new Error('Veículo não encontrado');
    }
    
    // Agora exclua o veículo
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error in delete query:', error);
      throw error;
    }
    
    console.log('Vehicle successfully deleted');
    return true;
  } catch (error: any) {
    console.error('Error deleting vehicle:', error);
    toast.error(`Erro ao excluir veículo: ${error.message || 'Tente novamente'}`);
    throw error;
  }
}

// Seller Services
export const getSellers = async () => {
  try {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return data as Seller[];
  } catch (error: any) {
    console.error('Error fetching sellers:', error);
    toast.error(`Erro ao carregar vendedores: ${error.message || 'Tente novamente'}`);
    return [];
  }
}

export const getSellerById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('id_seller', id) // Changed from id to id_seller
      .single();
      
    if (error) throw error;
    
    return data as Seller;
  } catch (error: any) {
    console.error('Error fetching seller:', error);
    toast.error(`Erro ao carregar dados do vendedor: ${error.message || 'Tente novamente'}`);
    throw error;
  }
}

export const createSeller = async (sellerData: Partial<Seller>) => {
  try {
    // Since we're using id_seller as the primary key now
    const { data: newSeller, error } = await supabase
      .from('sellers')
      .insert({
        name: sellerData.name || '',
        phone: sellerData.phone || '',
        email: sellerData.email,
        city: sellerData.city || '',
        state: sellerData.state || '',
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error in createSeller:', error);
      throw error;
    }
    
    toast.success(`${newSeller.name} cadastrado com sucesso!`);
    return newSeller as Seller;
  } catch (error: any) {
    console.error('Error creating seller:', error);
    toast.error(`Erro ao cadastrar vendedor: ${error.message || 'Tente novamente'}`);
    throw error;
  }
}

export const updateSeller = async (id: string, sellerData: Partial<Seller>) => {
  try {
    const { data, error } = await supabase
      .from('sellers')
      .update(sellerData)
      .eq('id_seller', id) // Changed from id to id_seller
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success(`${data.name} atualizado com sucesso!`);
    return data as Seller;
  } catch (error: any) {
    console.error('Error updating seller:', error);
    toast.error(`Erro ao atualizar vendedor: ${error.message || 'Tente novamente'}`);
    throw error;
  }
}

export const deleteSeller = async (id: string) => {
  try {
    console.log('Deleting seller with ID:', id);
    const { error } = await supabase
      .from('sellers')
      .delete()
      .eq('id_seller', id); // Changed from id to id_seller
      
    if (error) {
      console.error('Error in deleteSeller:', error);
      throw error;
    }
    
    toast.success("Vendedor excluído com sucesso!");
    return true;
  } catch (error: any) {
    console.error('Error deleting seller:', error);
    toast.error(`Erro ao excluir vendedor: ${error.message || 'Tente novamente'}`);
    throw error;
  }
}

// Proposal Services
export const getProposals = async () => {
  try {
    console.log('Fetching proposals from Supabase...');
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        vehicle:vehicle_id (
          id,
          brand,
          model,
          year
        )
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    console.log('Proposals data from Supabase:', data);
    
    if (!data || data.length === 0) {
      console.log('No proposals found');
    }
    
    return data;
  } catch (error: any) {
    console.error('Error in getProposals:', error);
    toast.error(`Erro ao carregar propostas: ${error.message || 'Tente novamente'}`);
    return [];
  }
}

export const getProposalById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        vehicle:vehicle_id (
          id,
          brand,
          model,
          year
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error in getProposalById:', error);
    toast.error(`Erro ao carregar proposta: ${error.message || 'Tente novamente'}`);
    throw error;
  }
}

export const createProposal = async (proposalData: Partial<Proposal>) => {
  try {
    // Ensure required fields are present
    const dbProposal = {
      name: proposalData.name || '',
      email: proposalData.email || '',
      phone: proposalData.phone || '',
      message: proposalData.message || '',
      vehicle_id: proposalData.vehicle_id || '',
      status: 'pending'
    };
    
    const { data, error } = await supabase
      .from('proposals')
      .insert(dbProposal)
      .select()
      .single();
      
    if (error) throw error;
    
    // Trigger notification for new proposal
    try {
      await supabase.functions.invoke('send-proposal-notification', {
        body: {
          proposalId: data.id,
          vehicleId: data.vehicle_id,
          customerName: data.name,
          customerEmail: data.email
        }
      });
      
      toast.success("Proposta enviada com sucesso! Entraremos em contato em breve.");
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
      toast.success("Proposta enviada com sucesso! Entraremos em contato em breve.");
      console.log('Notification error:', notificationError);
    }
    
    return data as Proposal;
  } catch (error: any) {
    console.error('Error creating proposal:', error);
    toast.error(`Erro ao enviar proposta: ${error.message || 'Tente novamente'}`);
    throw error;
  }
}

export const updateProposalStatus = async (id: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success(`Proposta marcada como ${status}.`);
    return data as Proposal;
  } catch (error: any) {
    console.error('Error updating proposal:', error);
    toast.error(`Erro ao atualizar proposta: ${error.message || 'Tente novamente'}`);
    throw error;
  }
}

export const deleteProposal = async (id: string) => {
  try {
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast.success("Proposta excluída com sucesso!");
    return true;
  } catch (error: any) {
    console.error('Error deleting proposal:', error);
    toast.error(`Erro ao excluir proposta: ${error.message || 'Tente novamente'}`);
    throw error;
  }
}

// Dashboard Statistics
export const getDashboardStats = async () => {
  try {
    // Use real data from Supabase instead of mocks
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id, brand, status');
    
    if (vehiclesError) throw vehiclesError;
    
    const { data: proposals, error: proposalsError } = await supabase
      .from('proposals')
      .select('id, status');
    
    if (proposalsError) throw proposalsError;
    
    // Calculate actual statistics
    const totalVehicles = vehicles.length;
    const soldVehicles = vehicles.filter(v => v.status === 'sold').length;
    const reservedVehicles = vehicles.filter(v => v.status === 'reserved').length;
    const totalProposals = proposals.length;
    const pendingProposals = proposals.filter(p => p.status === 'pending').length;
    const contactedProposals = proposals.filter(p => p.status === 'contacted').length;
    const closedProposals = proposals.filter(p => p.status === 'closed').length;
    
    // Find top brand
    const brandCounts = vehicles.reduce((counts: Record<string, number>, vehicle) => {
      const brand = vehicle.brand;
      counts[brand] = (counts[brand] || 0) + 1;
      return counts;
    }, {});
    
    let topBrandName = '';
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
        name: topBrandName || 'Nenhuma',
        count: topBrandCount
      },
      newProposals: pendingProposals
    };
  } catch (error: any) {
    console.error('Error getting dashboard stats:', error);
    toast.error(`Erro ao carregar estatísticas: ${error.message || 'Tente novamente'}`);
    
    // Return zero values as fallback
    return {
      totalVehicles: 0,
      soldVehicles: 0,
      reservedVehicles: 0,
      totalProposals: 0,
      pendingProposals: 0,
      contactedProposals: 0,
      closedProposals: 0,
      topBrand: {
        name: 'Nenhuma',
        count: 0
      },
      newProposals: 0
    };
  }
}

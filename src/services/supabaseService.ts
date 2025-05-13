
import { supabase } from '@/integrations/supabase/client';
import { Vehicle, Seller, Proposal } from '@/types';
import { toast } from '@/hooks/use-toast';

// Vehicle Services
export const getVehicles = async (filters?: any) => {
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
  
  if (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
  
  return data as Vehicle[];
}

export const getVehicleById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
    
    return data as Vehicle;
  } catch (error) {
    console.error('Error in getVehicleById:', error);
    // Fallback to using mock data
    throw error;
  }
}

export const createVehicle = async (vehicleData: Partial<Vehicle>) => {
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
    
  if (error) {
    console.error('Error creating vehicle:', error);
    toast({
      title: "Erro ao cadastrar veículo",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  toast({
    title: "Veículo cadastrado com sucesso!",
    description: `${data.brand} ${data.model} adicionado ao sistema.`
  });
  
  return data as Vehicle;
}

export const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
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
    .single();
    
  if (error) {
    console.error('Error updating vehicle:', error);
    toast({
      title: "Erro ao atualizar veículo",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  toast({
    title: "Veículo atualizado com sucesso!",
    description: `${data.brand} ${data.model} foi atualizado.`
  });
  
  return data as Vehicle;
}

export const deleteVehicle = async (id: string) => {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting vehicle:', error);
    toast({
      title: "Erro ao excluir veículo",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  toast({
    title: "Veículo excluído com sucesso!",
  });
  
  return true;
}

// Seller Services
export const getSellers = async () => {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching sellers:', error);
    throw error;
  }
  
  return data as Seller[];
}

export const getSellerById = async (id: string) => {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching seller:', error);
    throw error;
  }
  
  return data as Seller;
}

export const createSeller = async (sellerData: Partial<Seller>) => {
  // Ensure required fields are present
  const dbSeller = {
    id: sellerData.id || crypto.randomUUID(),
    name: sellerData.name || '',
    phone: sellerData.phone || '',
    email: sellerData.email,
    city: sellerData.city || '',
    state: sellerData.state || '',
  };
  
  const { data, error } = await supabase
    .from('sellers')
    .insert(dbSeller)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating seller:', error);
    toast({
      title: "Erro ao cadastrar vendedor",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  toast({
    title: "Vendedor cadastrado com sucesso!",
    description: `${data.name} adicionado ao sistema.`
  });
  
  return data as Seller;
}

export const updateSeller = async (id: string, sellerData: Partial<Seller>) => {
  const { data, error } = await supabase
    .from('sellers')
    .update(sellerData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating seller:', error);
    toast({
      title: "Erro ao atualizar vendedor",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  toast({
    title: "Vendedor atualizado com sucesso!",
    description: `${data.name} foi atualizado.`
  });
  
  return data as Seller;
}

export const deleteSeller = async (id: string) => {
  const { error } = await supabase
    .from('sellers')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting seller:', error);
    toast({
      title: "Erro ao excluir vendedor",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  toast({
    title: "Vendedor excluído com sucesso!",
  });
  
  return true;
}

// Proposal Services
export const getProposals = async () => {
  const { data, error } = await supabase
    .from('proposals')
    .select('*, vehicles!inner(*)')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching proposals:', error);
    throw error;
  }
  
  return data.map((proposal: any) => {
    const { vehicles, ...proposalData } = proposal;
    return {
      ...proposalData,
      vehicle_id: proposalData.vehicle_id,
      vehicleInfo: vehicles
    } as Proposal;
  });
}

export const getProposalById = async (id: string) => {
  const { data, error } = await supabase
    .from('proposals')
    .select('*, vehicles!inner(*)')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching proposal:', error);
    throw error;
  }
  
  const { vehicles, ...proposalData } = data;
  return {
    ...proposalData,
    vehicle_id: proposalData.vehicle_id,
    vehicleInfo: vehicles
  } as Proposal;
}

export const createProposal = async (proposalData: Partial<Proposal>) => {
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
    
  if (error) {
    console.error('Error creating proposal:', error);
    toast({
      title: "Erro ao enviar proposta",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
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
    
    toast({
      title: "Proposta enviada com sucesso!",
      description: "Entraremos em contato em breve."
    });
  } catch (notificationError) {
    console.error('Error sending notification:', notificationError);
    toast({
      title: "Proposta enviada com sucesso!",
      description: "Entraremos em contato em breve, mas houve um problema ao enviar a notificação."
    });
  }
  
  return data as Proposal;
}

export const updateProposalStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('proposals')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating proposal:', error);
    toast({
      title: "Erro ao atualizar proposta",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  toast({
    title: "Status da proposta atualizado",
    description: `Proposta marcada como ${status}.`
  });
  
  return data as Proposal;
}

export const deleteProposal = async (id: string) => {
  const { error } = await supabase
    .from('proposals')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting proposal:', error);
    toast({
      title: "Erro ao excluir proposta",
      description: error.message,
      variant: "destructive"
    });
    throw error;
  }
  
  toast({
    title: "Proposta excluída com sucesso!",
  });
  
  return true;
}

// Dashboard Statistics
export const getDashboardStats = async () => {
  const { data: vehicles, error: vehiclesError } = await supabase
    .from('vehicles')
    .select('status');
  
  if (vehiclesError) {
    console.error('Error fetching vehicles for stats:', vehiclesError);
    throw vehiclesError;
  }
  
  const { data: proposals, error: proposalsError } = await supabase
    .from('proposals')
    .select('status');
  
  if (proposalsError) {
    console.error('Error fetching proposals for stats:', proposalsError);
    throw proposalsError;
  }
  
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const soldVehicles = vehicles.filter(v => v.status === 'sold').length;
  const totalProposals = proposals.length;
  const pendingProposals = proposals.filter(p => p.status === 'pending').length;
  const acceptedProposals = proposals.filter(p => p.status === 'accepted').length;
  
  return {
    totalVehicles,
    availableVehicles,
    soldVehicles,
    totalProposals,
    pendingProposals,
    acceptedProposals,
    conversionRate: totalVehicles > 0 ? (soldVehicles / totalVehicles) * 100 : 0,
  };
}


import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "./types";

export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (profile) {
      return {
        id: userId,
        email: profile.email || '',
        name: profile.name,
        cpf: profile.cpf || undefined,
        phone: profile.phone || undefined,
        role: profile.role as "user" | "admin"
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    toast.error("Erro ao carregar perfil do usuário");
    return null;
  }
};

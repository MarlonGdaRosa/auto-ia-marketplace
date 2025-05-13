
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "./types";

export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Usando maybeSingle em vez de single para evitar erro quando nenhum perfil for encontrado
    
    if (error) {
      throw error;
    }
    
    if (profile) {
      return {
        id: userId,
        email: profile.email || '',
        name: profile.name || 'Usuário',
        cpf: profile.cpf || undefined,
        phone: profile.phone || undefined,
        role: profile.role as "user" | "admin" || "user"
      };
    } else {
      console.log("Perfil não encontrado, criando perfil padrão para", userId);
      // Se o perfil não existir, retornamos um perfil padrão
      return {
        id: userId,
        email: '',
        name: 'Usuário',
        role: "user"
      };
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    toast.error("Erro ao carregar perfil do usuário");
    // Retornamos um perfil padrão em caso de erro
    return {
      id: userId,
      email: '',
      name: 'Usuário',
      role: "user"
    };
  }
};

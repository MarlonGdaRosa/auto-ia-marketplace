import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CustomFieldDefinition {
  id: string;
  field_name: string;
  field_key: string;
  field_type: string;
  field_options?: any;
  is_required: boolean;
  display_order: number;
}

export const useCustomFields = () => {
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomFields = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('custom_field_definitions')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setCustomFields(data || []);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomFields();
  }, []);

  return { customFields, loading, refetch: fetchCustomFields };
};
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CustomFieldDefinition {
  field_key: string;
  field_name: string;
}

interface CustomFieldRendererProps {
  customFields: Record<string, any>;
}

export const CustomFieldRenderer = ({ customFields }: CustomFieldRendererProps) => {
  const [fieldDefinitions, setFieldDefinitions] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFieldDefinitions = async () => {
      try {
        const { data, error } = await supabase
          .from('custom_field_definitions')
          .select('field_key, field_name');

        if (error) throw error;

        const definitions = data?.reduce((acc, field) => {
          acc[field.field_key] = field.field_name;
          return acc;
        }, {} as Record<string, string>) || {};

        setFieldDefinitions(definitions);
      } catch (error) {
        console.error('Error fetching field definitions:', error);
      }
    };

    if (Object.keys(customFields).length > 0) {
      fetchFieldDefinitions();
    }
  }, [customFields]);

  if (!customFields || Object.keys(customFields).length === 0) {
    return null;
  }

  return (
    <div className="mt-3">
      <p className="font-medium text-foreground mb-2">Campos Personalizados:</p>
      {Object.entries(customFields).map(([key, value]) => (
        <p key={key} className="text-muted-foreground">
          <span className="font-medium">{fieldDefinitions[key] || key}:</span> {String(value)}
        </p>
      ))}
    </div>
  );
};
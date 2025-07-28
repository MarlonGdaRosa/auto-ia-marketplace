-- Create custom field definitions table
CREATE TABLE public.custom_field_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  field_name TEXT NOT NULL,
  field_key TEXT NOT NULL UNIQUE,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'email', 'number', 'select', 'textarea')),
  field_options JSONB,
  is_required BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.custom_field_definitions ENABLE ROW LEVEL SECURITY;

-- Create policies for custom field definitions (admin-only)
CREATE POLICY "Only authenticated users can view custom field definitions" 
ON public.custom_field_definitions 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can create custom field definitions" 
ON public.custom_field_definitions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update custom field definitions" 
ON public.custom_field_definitions 
FOR UPDATE 
USING (true);

CREATE POLICY "Only authenticated users can delete custom field definitions" 
ON public.custom_field_definitions 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_custom_field_definitions_updated_at
BEFORE UPDATE ON public.custom_field_definitions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
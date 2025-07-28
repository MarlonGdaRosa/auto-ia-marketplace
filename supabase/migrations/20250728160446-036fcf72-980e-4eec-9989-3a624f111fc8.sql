-- Drop existing policies for custom_field_definitions
DROP POLICY IF EXISTS "Only authenticated users can view custom field definitions" ON public.custom_field_definitions;
DROP POLICY IF EXISTS "Only authenticated users can create custom field definitions" ON public.custom_field_definitions;
DROP POLICY IF EXISTS "Only authenticated users can update custom field definitions" ON public.custom_field_definitions;
DROP POLICY IF EXISTS "Only authenticated users can delete custom field definitions" ON public.custom_field_definitions;

-- Create new policies that properly restrict to authenticated users only
CREATE POLICY "Only authenticated users can view custom field definitions" 
ON public.custom_field_definitions 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Only authenticated users can create custom field definitions" 
ON public.custom_field_definitions 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update custom field definitions" 
ON public.custom_field_definitions 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Only authenticated users can delete custom field definitions" 
ON public.custom_field_definitions 
FOR DELETE 
TO authenticated
USING (true);
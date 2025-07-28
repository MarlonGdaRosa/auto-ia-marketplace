-- Add status column to store_submissions table
ALTER TABLE public.store_submissions 
ADD COLUMN status TEXT NOT NULL DEFAULT 'Sem contato';

-- Add check constraint for valid status values
ALTER TABLE public.store_submissions 
ADD CONSTRAINT valid_status CHECK (status IN ('Sem contato', 'Em negociação', 'Negócio Fechado'));
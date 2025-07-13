-- Add exported_at column to track when data was exported but not yet migrated
ALTER TABLE public.setoran 
ADD COLUMN exported_at TIMESTAMP WITH TIME ZONE;
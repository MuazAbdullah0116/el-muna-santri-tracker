-- Buat tabel untuk melacak arsip data yang sudah dimigrasi
CREATE TABLE public.setoran_archives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  archive_name TEXT NOT NULL,
  google_sheet_id TEXT NOT NULL,
  google_sheet_url TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_records INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.setoran_archives ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to archives" 
ON public.setoran_archives 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to archives" 
ON public.setoran_archives 
FOR INSERT 
WITH CHECK (true);

-- Tambah kolom untuk menandai data yang sudah diarsipkan
ALTER TABLE public.setoran 
ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE;

-- Index untuk query yang efisien
CREATE INDEX idx_setoran_archived_at ON public.setoran(archived_at);
CREATE INDEX idx_setoran_archives_period ON public.setoran_archives(period_start, period_end);
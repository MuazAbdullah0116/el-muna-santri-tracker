
-- Create santri table
CREATE TABLE IF NOT EXISTS public.santri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    kelas INTEGER NOT NULL,
    jenis_kelamin TEXT NOT NULL CHECK (jenis_kelamin IN ('Ikhwan', 'Akhwat')),
    total_hafalan INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create setoran table
CREATE TABLE IF NOT EXISTS public.setoran (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    santri_id UUID NOT NULL REFERENCES public.santri(id) ON DELETE CASCADE,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    juz INTEGER NOT NULL,
    surat TEXT NOT NULL,
    awal_ayat INTEGER NOT NULL,
    akhir_ayat INTEGER NOT NULL,
    kelancaran INTEGER NOT NULL CHECK (kelancaran BETWEEN 1 AND 10),
    tajwid INTEGER NOT NULL CHECK (tajwid BETWEEN 1 AND 10),
    tahsin INTEGER NOT NULL CHECK (tahsin BETWEEN 1 AND 10),
    catatan TEXT,
    diuji_oleh TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_santri_kelas ON public.santri(kelas);
CREATE INDEX IF NOT EXISTS idx_santri_jenis_kelamin ON public.santri(jenis_kelamin);
CREATE INDEX IF NOT EXISTS idx_setoran_santri_id ON public.setoran(santri_id);
CREATE INDEX IF NOT EXISTS idx_setoran_tanggal ON public.setoran(tanggal);

-- Add RLS policies
ALTER TABLE public.santri ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setoran ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (administrators)
CREATE POLICY "Allow full access to authenticated users" ON public.santri
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON public.setoran
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create policies for anonymous users (read-only)
CREATE POLICY "Allow read access to anonymous users" ON public.santri
    FOR SELECT
    USING (true);

CREATE POLICY "Allow read access to anonymous users" ON public.setoran
    FOR SELECT
    USING (true);

import { supabase } from './client';

export interface SetoranArchive {
  id: string;
  archive_name: string;
  google_sheet_id: string;
  google_sheet_url: string;
  period_start: string;
  period_end: string;
  total_records: number;
  created_at: string;
}

export interface MigrationStatus {
  success: boolean;
  latestArchive: SetoranArchive | null;
  pendingMigrationCount: number;
  cutoffDate: string;
}

export interface MigrationResult {
  success: boolean;
  message: string;
  recordsProcessed: number;
  archiveName?: string;
  sheetUrl?: string;
  archiveId?: string;
  error?: string;
}

/**
 * Fetch all setoran archives
 */
export async function fetchSetoranArchives(): Promise<SetoranArchive[]> {
  try {
    const { data, error } = await supabase
      .from('setoran_archives')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching archives:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchSetoranArchives:', error);
    throw error;
  }
}

/**
 * Get migration status
 */
export async function getMigrationStatus(): Promise<MigrationStatus> {
  try {
    const { data, error } = await supabase.functions.invoke('migrate-setoran', {
      method: 'GET'
    });

    if (error) {
      console.error('Error getting migration status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getMigrationStatus:', error);
    throw error;
  }
}

/**
 * Start migration process
 */
export async function startMigration(force: boolean = false): Promise<MigrationResult> {
  try {
    const { data, error } = await supabase.functions.invoke('migrate-setoran', {
      method: 'POST',
      body: { force }
    });

    if (error) {
      console.error('Error starting migration:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in startMigration:', error);
    throw error;
  }
}

/**
 * Fetch setoran data from Google Sheets (for archived data)
 */
export async function fetchArchivedSetoran(archiveId: string): Promise<any[]> {
  try {
    // Get archive info
    const { data: archive, error } = await supabase
      .from('setoran_archives')
      .select('*')
      .eq('id', archiveId)
      .single();

    if (error) {
      console.error('Error fetching archive info:', error);
      throw error;
    }

    if (!archive) {
      throw new Error('Archive not found');
    }

    // Note: Untuk mengambil data dari Google Sheets, perlu implementasi 
    // Google Sheets API di frontend atau edge function terpisah
    // Untuk sekarang, return empty array sebagai placeholder
    console.log('Archive URL:', archive.google_sheet_url);
    
    return [];
  } catch (error) {
    console.error('Error in fetchArchivedSetoran:', error);
    throw error;
  }
}

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
  needsMigration: boolean;
  lastMigrationDate: string | null;
  pendingRecordsCount: number;
  hasExportedData: boolean;
  lastExportDate: string | null;
  exportedRecordsCount: number;
  totalRowsCount: number;
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
 * Get migration status based on 7000 rows limit
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
 * Export data to CSV when 7000+ rows reached
 */
export async function exportToCSV(): Promise<{ success: boolean; csvData?: string; filename?: string; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('migrate-setoran', {
      method: 'POST',
      body: { action: 'export_csv' }
    });

    if (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in exportToCSV:', error);
    throw error;
  }
}

/**
 * Mark migration as completed and delete exported data
 */
export async function completeMigration(archiveName: string, sheetUrl: string): Promise<MigrationResult> {
  try {
    const { data, error } = await supabase.functions.invoke('migrate-setoran', {
      method: 'POST',
      body: { action: 'complete_migration', archiveName, sheetUrl }
    });

    if (error) {
      console.error('Error completing migration:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in completeMigration:', error);
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

    // Fetch data from Google Sheets using edge function
    const { data, error: fetchError } = await supabase.functions.invoke('fetch-sheets-data', {
      method: 'POST',
      body: { 
        spreadsheetId: archive.google_sheet_id,
        sheetUrl: archive.google_sheet_url 
      }
    });

    if (fetchError) {
      console.error('Error fetching from Google Sheets:', fetchError);
      throw fetchError;
    }

    return data?.records || [];
  } catch (error) {
    console.error('Error in fetchArchivedSetoran:', error);
    throw error;
  }
}

/**
 * Verify Google Sheets access before completing migration
 */
export async function verifySheetAccess(sheetUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-sheet-access', {
      method: 'POST',
      body: { sheetUrl }
    });

    if (error) {
      console.error('Error verifying sheet access:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in verifySheetAccess:', error);
    return { success: false, error: error.message };
  }
}

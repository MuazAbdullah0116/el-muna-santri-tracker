
import { Santri, Setoran } from "@/types";

export interface ExportData {
  santri: Santri[];
  setoran: Setoran[];
}

/**
 * Converts data to CSV format
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

/**
 * Converts data to Excel-compatible format
 */
export const exportToExcel = (santriData: Santri[], setoranData: Setoran[]) => {
  // Create workbook content
  const santriHeaders = ['ID', 'Nama', 'Kelas', 'Jenis Kelamin', 'Total Hafalan', 'Created At'];
  const setoranHeaders = ['ID', 'Santri ID', 'Tanggal', 'Juz', 'Surat', 'Awal Ayat', 'Akhir Ayat', 'Kelancaran', 'Tajwid', 'Tahsin', 'Catatan', 'Diuji Oleh', 'Created At'];
  
  let content = 'Santri Data\n';
  content += santriHeaders.join('\t') + '\n';
  santriData.forEach(santri => {
    content += [
      santri.id,
      santri.nama,
      santri.kelas,
      santri.jenis_kelamin,
      santri.total_hafalan || 0,
      santri.created_at || ''
    ].join('\t') + '\n';
  });
  
  content += '\n\nSetoran Data\n';
  content += setoranHeaders.join('\t') + '\n';
  setoranData.forEach(setoran => {
    content += [
      setoran.id,
      setoran.santri_id,
      setoran.tanggal,
      setoran.juz,
      setoran.surat,
      setoran.awal_ayat,
      setoran.akhir_ayat,
      setoran.kelancaran,
      setoran.tajwid,
      setoran.tahsin,
      setoran.catatan || '',
      setoran.diuji_oleh,
      setoran.created_at || ''
    ].join('\t') + '\n';
  });

  downloadFile(content, 'data_santri_complete.xls', 'application/vnd.ms-excel');
};

/**
 * Helper function to download files
 */
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Parses CSV content
 */
export const parseCSV = (content: string): any[] => {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }

  return data;
};

/**
 * Parses a single CSV line handling quotes and commas
 */
const parseCSVLine = (line: string): string[] => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

/**
 * Reads file content
 */
export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

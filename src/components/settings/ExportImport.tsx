import { useState } from "react";
import { Download, Upload, FileSpreadsheet, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { fetchSantri } from "@/services/googleSheets/santri.service";
import { fetchSetoran } from "@/services/googleSheets/setoran.service";
import { exportToCSV, exportToExcel, parseCSV, readFileContent } from "@/services/exportImport.service";

const ExportImport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const [santriData, setoranData] = await Promise.all([
        fetchSantri(),
        fetchSetoran()
      ]);

      // Export santri data
      exportToCSV(santriData, 'data_santri');
      
      // Export setoran data
      exportToCSV(setoranData, 'data_setoran');

      toast({
        title: "Export Berhasil",
        description: "Data santri dan setoran telah diekspor ke file CSV",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat mengekspor data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const [santriData, setoranData] = await Promise.all([
        fetchSantri(),
        fetchSetoran()
      ]);

      exportToExcel(santriData, setoranData);

      toast({
        title: "Export Berhasil", 
        description: "Data lengkap telah diekspor ke file Excel",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat mengekspor data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Format File Salah",
        description: "Hanya file CSV yang didukung untuk import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const content = await readFileContent(file);
      const parsedData = parseCSV(content);
      
      console.log("Parsed data:", parsedData);
      
      toast({
        title: "File Berhasil Dibaca",
        description: `${parsedData.length} baris data berhasil diparse. Fitur import ke Google Sheets akan segera tersedia.`,
      });
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import Gagal",
        description: "Terjadi kesalahan saat membaca file",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-islamic-primary">
            <Download className="w-5 h-5" />
            Export Data
          </CardTitle>
          <CardDescription>
            Ekspor data santri dan setoran ke file spreadsheet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="flex items-center gap-2 bg-islamic-secondary hover:bg-islamic-secondary/90"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {isExporting ? "Mengekspor..." : "Export ke CSV"}
            </Button>
            
            <Button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="flex items-center gap-2 bg-islamic-primary hover:bg-islamic-primary/90"
            >
              <Database className="w-4 h-4" />
              {isExporting ? "Mengekspor..." : "Export ke Excel"}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground bg-islamic-light/20 p-3 rounded-lg">
            <p className="font-medium mb-1">Catatan Export:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>CSV: Menghasilkan 2 file terpisah (santri & setoran)</li>
              <li>Excel: Menghasilkan 1 file dengan semua data</li>
              <li>File dapat dibuka di Google Sheets, Excel, atau Numbers</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-islamic-secondary">
            <Upload className="w-5 h-5" />
            Import Data
          </CardTitle>
          <CardDescription>
            Import data dari file CSV (fitur dalam pengembangan)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleImportFile}
              disabled={isImporting}
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-islamic-primary file:text-white
                hover:file:bg-islamic-primary/90
                file:cursor-pointer cursor-pointer"
            />
          </div>
          
          <div className="text-sm text-muted-foreground bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="font-medium mb-1">⚠️ Fitur Import:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Saat ini hanya bisa membaca dan validasi file CSV</li>
              <li>Import ke Google Sheets akan segera tersedia</li>
              <li>Pastikan format CSV sesuai dengan hasil export</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportImport;

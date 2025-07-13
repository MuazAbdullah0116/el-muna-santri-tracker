import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ChevronUp, GraduationCap, Download, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { exportToCSV } from '@/services/supabase/archive.service';

export default function ClassPromotionSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasExportedClass12, setHasExportedClass12] = useState(false);

  // Only show for authenticated users
  if (!user || user === "Wali") {
    return null;
  }

  const handlePromoteAllClasses = async () => {
    setIsProcessing(true);
    
    try {
      // Promote classes 7-11 to next level
      for (let currentClass = 11; currentClass >= 7; currentClass--) {
        const { error } = await supabase
          .from('santri')
          .update({ kelas: currentClass + 1 })
          .eq('kelas', currentClass);
        
        if (error) throw error;
      }
      
      toast({
        title: "Berhasil",
        description: "Semua kelas telah dinaikkan. Kelas 12 sekarang perlu diekspor dan dihapus.",
      });
      
      setShowPromotionDialog(false);
    } catch (error) {
      console.error("Error promoting classes:", error);
      toast({
        title: "Error",
        description: "Gagal menaikkan kelas",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportClass12 = async () => {
    setIsProcessing(true);
    
    try {
      // Export only class 12 data
      const { data: class12Santri, error: santriError } = await supabase
        .from('santri')
        .select('*')
        .eq('kelas', 12);
      
      if (santriError) throw santriError;
      
      if (!class12Santri || class12Santri.length === 0) {
        toast({
          title: "Info",
          description: "Tidak ada data kelas 12 untuk diekspor",
        });
        setIsProcessing(false);
        return;
      }
      
      // Get setoran data for class 12 students
      const santriIds = class12Santri.map(s => s.id);
      const { data: setoranData, error: setoranError } = await supabase
        .from('setoran')
        .select('*')
        .in('santri_id', santriIds);
      
      if (setoranError) throw setoranError;
      
      // Prepare CSV data
      const csvRows = [];
      csvRows.push([
        'Nama Santri', 'Kelas', 'Jenis Kelamin', 'Tanggal Setoran', 
        'Surat', 'Juz', 'Awal Ayat', 'Akhir Ayat', 
        'Kelancaran', 'Tajwid', 'Tahsin', 'Diuji Oleh', 'Catatan'
      ]);
      
      setoranData?.forEach(setoran => {
        const santri = class12Santri.find(s => s.id === setoran.santri_id);
        if (santri) {
          csvRows.push([
            santri.nama,
            santri.kelas,
            santri.jenis_kelamin,
            setoran.tanggal,
            setoran.surat,
            setoran.juz,
            setoran.awal_ayat,
            setoran.akhir_ayat,
            setoran.kelancaran,
            setoran.tajwid,
            setoran.tahsin,
            setoran.diuji_oleh,
            setoran.catatan || ''
          ]);
        }
      });
      
      const csvContent = csvRows.map(row => 
        row.map(field => `"${field}"`).join(',')
      ).join('\n');
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `data-kelas-12-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setHasExportedClass12(true);
      
      toast({
        title: "Berhasil",
        description: "Data kelas 12 berhasil diekspor. Sekarang Anda dapat menghapus data tersebut.",
      });
      
    } catch (error) {
      console.error("Error exporting class 12:", error);
      toast({
        title: "Error",
        description: "Gagal mengekspor data kelas 12",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteClass12 = async () => {
    if (!hasExportedClass12) {
      toast({
        title: "Peringatan",
        description: "Harap ekspor data kelas 12 terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Delete setoran records for class 12 students first
      const { data: class12Santri, error: santriError } = await supabase
        .from('santri')
        .select('id')
        .eq('kelas', 12);
      
      if (santriError) throw santriError;
      
      if (class12Santri && class12Santri.length > 0) {
        const santriIds = class12Santri.map(s => s.id);
        
        // Delete setoran records
        const { error: setoranError } = await supabase
          .from('setoran')
          .delete()
          .in('santri_id', santriIds);
        
        if (setoranError) throw setoranError;
        
        // Delete santri records
        const { error: deleteError } = await supabase
          .from('santri')
          .delete()
          .eq('kelas', 12);
        
        if (deleteError) throw deleteError;
      }
      
      toast({
        title: "Berhasil",
        description: "Data kelas 12 berhasil dihapus",
      });
      
      setShowDeleteDialog(false);
      setHasExportedClass12(false);
      
    } catch (error) {
      console.error("Error deleting class 12:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus data kelas 12",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Card className="bg-card border border-border text-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-islamic-primary">
            <GraduationCap className="w-5 h-5" />
            Kenaikan Kelas
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Kelola kenaikan kelas otomatis dan penanganan data kelas 12
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 bg-islamic-light/10 rounded-lg border border-islamic-primary/20">
              <h4 className="font-medium text-foreground mb-2">Kenaikan Kelas Otomatis</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Naikkan semua santri ke kelas berikutnya: Kelas 7→8, 8→9, 9→10, 10→11, 11→12
              </p>
              <Button
                onClick={() => setShowPromotionDialog(true)}
                className="w-full bg-gradient-to-r from-islamic-primary to-islamic-secondary hover:from-islamic-primary/90 hover:to-islamic-secondary/90"
                disabled={isProcessing}
              >
                <ChevronUp className="w-4 h-4 mr-2" />
                Naikkan Semua Kelas
              </Button>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-medium text-foreground mb-2">Manajemen Kelas 12</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Ekspor dan hapus data kelas 12 setelah kelulusan
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleExportClass12}
                  variant="outline"
                  className="flex-1"
                  disabled={isProcessing}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Ekspor Data Kelas 12
                </Button>
                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  className="flex-1"
                  disabled={isProcessing || !hasExportedClass12}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Data Kelas 12
                </Button>
              </div>
              {!hasExportedClass12 && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                  Ekspor data terlebih dahulu sebelum menghapus
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotion Dialog */}
      <Dialog open={showPromotionDialog} onOpenChange={setShowPromotionDialog}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <ChevronUp className="w-5 h-5 text-islamic-primary" />
              Konfirmasi Kenaikan Kelas
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Apakah Anda yakin ingin menaikkan semua kelas? Ini akan:
              <br />• Kelas 7 → Kelas 8
              <br />• Kelas 8 → Kelas 9  
              <br />• Kelas 9 → Kelas 10
              <br />• Kelas 10 → Kelas 11
              <br />• Kelas 11 → Kelas 12
              <br />
              <span className="text-destructive font-medium">Tindakan ini tidak dapat dibatalkan.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowPromotionDialog(false)}
              className="w-full sm:w-auto"
              disabled={isProcessing}
            >
              Batal
            </Button>
            <Button 
              onClick={handlePromoteAllClasses} 
              disabled={isProcessing}
              className="w-full sm:w-auto bg-gradient-to-r from-islamic-primary to-islamic-secondary hover:from-islamic-primary/90 hover:to-islamic-secondary/90"
            >
              <ChevronUp className="h-4 w-4 mr-2" />
              {isProcessing ? "Memproses..." : "Naikkan Semua Kelas"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Class 12 Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Trash2 className="w-5 h-5 text-destructive" />
              Konfirmasi Hapus Data Kelas 12
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Apakah Anda yakin ingin menghapus semua data kelas 12?
              <br />
              <span className="text-destructive font-medium">
                Semua data santri dan setoran kelas 12 akan dihapus permanen dan tidak dapat dikembalikan.
              </span>
              <br />
              <br />
              Pastikan Anda sudah mengekspor data terlebih dahulu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="w-full sm:w-auto"
              disabled={isProcessing}
            >
              Batal
            </Button>
            <Button 
              onClick={handleDeleteClass12} 
              disabled={isProcessing || !hasExportedClass12}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isProcessing ? "Menghapus..." : "Hapus Data Kelas 12"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
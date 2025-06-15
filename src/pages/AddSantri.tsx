
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createSantri } from "@/services/sheetdb/santri.service";

const AddSantri = () => {
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState<number>(7);
  const [jenisKelamin, setJenisKelamin] = useState<"Ikhwan" | "Akhwat">("Ikhwan");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Classes from 7 to 12
  const classes = [7, 8, 9, 10, 11, 12];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nama.trim()) {
      toast({
        title: "Error",
        description: "Nama santri harus diisi",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const santriData = {
        nama: nama.trim(),
        kelas,
        jenis_kelamin: jenisKelamin,
      };

      await createSantri(santriData);
      
      toast({
        title: "Berhasil",
        description: "Santri baru berhasil ditambahkan",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating santri:", error);
      toast({
        title: "Error",
        description: "Gagal menambahkan santri baru",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-islamic-accent/10 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4 hover:bg-islamic-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Dashboard
          </Button>
        </div>

        <Card className="shadow-2xl border-0 bg-card">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow-xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Tambah Santri Baru</CardTitle>
            <CardDescription className="text-muted-foreground">
              Masukkan data santri baru untuk memulai pencatatan hafalan
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nama" className="text-sm font-semibold text-foreground">
                  Nama Santri
                </Label>
                <Input
                  id="nama"
                  type="text"
                  placeholder="Masukkan nama lengkap santri"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="h-12 rounded-xl border-2 focus:border-islamic-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kelas" className="text-sm font-semibold text-foreground">
                  Kelas
                </Label>
                <Select value={kelas.toString()} onValueChange={(value) => setKelas(parseInt(value))}>
                  <SelectTrigger id="kelas" className="h-12 rounded-xl border-2 focus:border-islamic-primary">
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((kelasOption) => (
                      <SelectItem key={kelasOption} value={kelasOption.toString()}>
                        Kelas {kelasOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jenisKelamin" className="text-sm font-semibold text-foreground">
                  Jenis Kelamin
                </Label>
                <Select value={jenisKelamin} onValueChange={(value: "Ikhwan" | "Akhwat") => setJenisKelamin(value)}>
                  <SelectTrigger id="jenisKelamin" className="h-12 rounded-xl border-2 focus:border-islamic-primary">
                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ikhwan">Ikhwan (Laki-laki)</SelectItem>
                    <SelectItem value="Akhwat">Akhwat (Perempuan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-12 rounded-xl border-2"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-islamic-primary to-islamic-secondary hover:from-islamic-primary/90 hover:to-islamic-secondary/90 font-semibold shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Tambah Santri
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddSantri;

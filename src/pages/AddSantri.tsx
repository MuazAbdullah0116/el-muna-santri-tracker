import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createSantri } from "@/services/googleSheets/santri.service";

const AddSantri = () => {
  const [name, setName] = useState("");
  const [classroom, setClassroom] = useState<string>("");
  const [gender, setGender] = useState<"Ikhwan" | "Akhwat">("Ikhwan");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !classroom) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon lengkapi semua field",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting santri data:", {
        nama: name,
        kelas: parseInt(classroom),
        jenis_kelamin: gender
      });
      
      await createSantri({
        nama: name,
        kelas: parseInt(classroom),
        jenis_kelamin: gender,
      });
      
      toast({
        title: "Berhasil",
        description: "Data santri berhasil ditambahkan",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding santri:", error);
      toast({
        title: "Error",
        description: "Gagal menambahkan data santri. Mohon coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white border border-islamic-primary/30 rounded-2xl shadow-lg">
      <Card className="bg-transparent shadow-none border-none">
        <CardHeader>
          <CardTitle>Tambah Santri</CardTitle>
          <CardDescription>
            Tambahkan data santri baru ke sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Santri</Label>
              <Input
                id="name"
                placeholder="Masukkan nama santri"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classroom">Kelas</Label>
              <Select
                value={classroom}
                onValueChange={setClassroom}
                required
              >
                <SelectTrigger id="classroom" className="bg-card">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-card shadow-xl">
                  {[7, 8, 9, 10, 11, 12].map((kelas) => (
                    <SelectItem 
                      key={kelas} 
                      value={kelas.toString()}
                      className="hover:bg-islamic-primary/10 focus:bg-islamic-primary/10"
                    >
                      Kelas {kelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Jenis Kelamin</Label>
              <RadioGroup
                value={gender}
                onValueChange={(val) => setGender(val as "Ikhwan" | "Akhwat")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ikhwan" id="ikhwan" className="border-islamic-primary focus:ring-islamic-primary" />
                  <Label htmlFor="ikhwan">Ikhwan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Akhwat" id="akhwat" className="border-islamic-primary focus:ring-islamic-primary" />
                  <Label htmlFor="akhwat">Akhwat</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="destructive"
                className="flex-1 border-destructive text-destructive bg-white hover:bg-destructive hover:text-white"
                onClick={() => navigate("/dashboard")}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-1 bg-islamic-primary hover:bg-islamic-primary/90 text-white shadow font-semibold"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSantri;

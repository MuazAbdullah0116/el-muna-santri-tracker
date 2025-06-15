import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createSantri } from "@/services/supabase/santri.service";

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
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-900 border border-islamic-primary/30 rounded-2xl shadow-lg">
      <Card className="bg-transparent shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Tambah Santri</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Tambahkan data santri baru ke sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-900 dark:text-white">Nama Santri</Label>
              <Input
                id="name"
                placeholder="Masukkan nama santri"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classroom" className="text-gray-900 dark:text-white">Kelas</Label>
              <Select
                value={classroom}
                onValueChange={setClassroom}
                required
              >
                <SelectTrigger id="classroom" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl">
                  {[7, 8, 9, 10, 11, 12].map((kelas) => (
                    <SelectItem 
                      key={kelas} 
                      value={kelas.toString()}
                      className="text-gray-900 dark:text-white hover:bg-islamic-primary/10 focus:bg-islamic-primary/10"
                    >
                      Kelas {kelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-white">Jenis Kelamin</Label>
              <RadioGroup
                value={gender}
                onValueChange={(val) => setGender(val as "Ikhwan" | "Akhwat")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ikhwan" id="ikhwan" className="border-islamic-primary focus:ring-islamic-primary" />
                  <Label htmlFor="ikhwan" className="text-gray-900 dark:text-white">Ikhwan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Akhwat" id="akhwat" className="border-islamic-primary focus:ring-islamic-primary" />
                  <Label htmlFor="akhwat" className="text-gray-900 dark:text-white">Akhwat</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
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

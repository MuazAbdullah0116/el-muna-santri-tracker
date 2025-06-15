
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Santri } from "@/types";
import { createSantri } from "@/services/supabase/santri.service";

const AddSantri = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    nama: "",
    kelas: "",
    jenis_kelamin: "" as "Ikhwan" | "Akhwat" | "",
  });

  const createSantriMutation = useMutation({
    mutationFn: (santriData: Omit<Santri, 'id' | 'created_at' | 'total_hafalan'>) => 
      createSantri(santriData),
    onSuccess: () => {
      toast.success("Santri berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: ["santris"] });
      navigate("/");
    },
    onError: (error) => {
      console.error("Error creating santri:", error);
      toast.error("Gagal menambahkan santri. Silakan coba lagi.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.kelas || !formData.jenis_kelamin) {
      toast.error("Semua field harus diisi!");
      return;
    }

    createSantriMutation.mutate({
      nama: formData.nama,
      kelas: parseInt(formData.kelas),
      jenis_kelamin: formData.jenis_kelamin,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Dashboard
        </Button>

        <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-emerald-800 text-center">
              Tambah Santri Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nama" className="text-emerald-700 font-medium">
                  Nama Lengkap *
                </Label>
                <Input
                  id="nama"
                  type="text"
                  placeholder="Masukkan nama lengkap santri"
                  value={formData.nama}
                  onChange={(e) => handleInputChange("nama", e.target.value)}
                  className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kelas" className="text-emerald-700 font-medium">
                  Kelas *
                </Label>
                <Select onValueChange={(value) => handleInputChange("kelas", value)}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400">
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {[7, 8, 9, 10, 11, 12].map((kelas) => (
                      <SelectItem key={kelas} value={kelas.toString()}>
                        Kelas {kelas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-emerald-700 font-medium">
                  Jenis Kelamin *
                </Label>
                <RadioGroup
                  value={formData.jenis_kelamin}
                  onValueChange={(value) => handleInputChange("jenis_kelamin", value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ikhwan" id="ikhwan" />
                    <Label htmlFor="ikhwan" className="text-emerald-700">Ikhwan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Akhwat" id="akhwat" />
                    <Label htmlFor="akhwat" className="text-emerald-700">Akhwat</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={createSantriMutation.isPending}
              >
                {createSantriMutation.isPending ? "Menambahkan..." : "Tambah Santri"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddSantri;

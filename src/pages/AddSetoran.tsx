import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import AddSetoranDatePicker from "@/components/add-setoran/AddSetoranDatePicker";
import AddSetoranExaminerInput from "@/components/add-setoran/AddSetoranExaminerInput";
import ScoreSelectGroup from "@/components/add-setoran/ScoreSelectGroup";
import { Setoran } from "@/types";
import { fetchSantri } from "@/services/supabase/santri.service";
import { createSetoran } from "@/services/supabase/setoran.service";
import { getSurahsForJuz, getMinAyatForSurahInJuz, getMaxAyatForSurahInJuz } from "@/services/supabase/client";
import SelectJuz from "@/components/add-setoran/SelectJuz";
import SelectSurah from "@/components/add-setoran/SelectSurah";
import AyatRangeInput from "@/components/add-setoran/AyatRangeInput";

const AddSetoran = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { santriId } = useParams<{ santriId: string }>();

  // Initialize formData with santri_id from the URL
  const [formData, setFormData] = useState({
    santri_id: santriId || "",
    tanggal: new Date(),
    juz: "",
    surat: "",
    awal_ayat: "",
    akhir_ayat: "",
    kelancaran: 5,
    tajwid: 5,
    tahsin: 5,
    catatan: "",
    diuji_oleh: "",
  });

  // Whenever the params change, update the formData.santri_id
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      santri_id: santriId ?? "",
    }));
  }, [santriId]);

  const createSetoranMutation = useMutation({
    mutationFn: (setoranData: Omit<Setoran, 'id' | 'created_at'>) => 
      createSetoran(setoranData),
    onSuccess: () => {
      toast.success("Setoran berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: ["setoran"] });
      queryClient.invalidateQueries({ queryKey: ["santris"] });
      navigate("/");
    },
    onError: (error) => {
      console.error("Error creating setoran:", error);
      toast.error("Gagal menambahkan setoran. Silakan coba lagi.");
    },
  });

  const availableSurahs = formData.juz ? getSurahsForJuz(formData.juz) : [];
  const minAyat = formData.juz && formData.surat ? getMinAyatForSurahInJuz(formData.juz, formData.surat) : 1;
  const maxAyat = formData.juz && formData.surat ? getMaxAyatForSurahInJuz(formData.juz, formData.surat) : 286;

  useEffect(() => {
    if (formData.juz && formData.surat) {
      const min = getMinAyatForSurahInJuz(formData.juz, formData.surat);
      if (!formData.awal_ayat) {
        setFormData(prev => ({ ...prev, awal_ayat: min.toString() }));
      }
    }
  }, [formData.juz, formData.surat]);

  useEffect(() => {
    if (formData.awal_ayat && !formData.akhir_ayat) {
      setFormData(prev => ({ ...prev, akhir_ayat: formData.awal_ayat }));
    }
  }, [formData.awal_ayat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.santri_id || !formData.juz || !formData.surat || 
        !formData.awal_ayat || !formData.akhir_ayat || !formData.diuji_oleh) {
      toast.error("Semua field yang wajib harus diisi!");
      return;
    }

    const awalAyat = parseInt(formData.awal_ayat);
    const akhirAyat = parseInt(formData.akhir_ayat);
    
    if (awalAyat > akhirAyat) {
      toast.error("Ayat awal tidak boleh lebih besar dari ayat akhir!");
      return;
    }

    if (awalAyat < minAyat || akhirAyat > maxAyat) {
      toast.error(`Ayat harus dalam rentang ${minAyat}-${maxAyat} untuk ${formData.surat} di Juz ${formData.juz}!`);
      return;
    }

    createSetoranMutation.mutate({
      santri_id: formData.santri_id,
      tanggal: formData.tanggal.toISOString().split('T')[0],
      juz: parseInt(formData.juz),
      surat: formData.surat,
      awal_ayat: awalAyat,
      akhir_ayat: akhirAyat,
      kelancaran: formData.kelancaran,
      tajwid: formData.tajwid,
      tahsin: formData.tahsin,
      catatan: formData.catatan,
      diuji_oleh: formData.diuji_oleh,
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4 text-white hover:text-emerald-200 hover:bg-emerald-800/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Dashboard
        </Button>

        <Card className="bg-gray-900/95 backdrop-blur-sm border-emerald-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Tambah Setoran Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AddSetoranDatePicker
                tanggal={formData.tanggal}
                onTanggalChange={(date) => handleInputChange("tanggal", date || new Date())}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectJuz
                  value={formData.juz}
                  onChange={(value) => {
                    handleInputChange("juz", value);
                    handleInputChange("surat", "");
                    handleInputChange("awal_ayat", "");
                    handleInputChange("akhir_ayat", "");
                  }}
                />

                <SelectSurah
                  value={formData.surat}
                  onChange={(value) => {
                    handleInputChange("surat", value);
                    handleInputChange("awal_ayat", "");
                    handleInputChange("akhir_ayat", "");
                  }}
                  availableSurahs={availableSurahs}
                  disabled={!formData.juz}
                />
              </div>

              <AyatRangeInput
                awalAyat={formData.awal_ayat}
                akhirAyat={formData.akhir_ayat}
                minAyat={minAyat}
                maxAyat={maxAyat}
                onAwalAyatChange={(v) => handleInputChange("awal_ayat", v)}
                onAkhirAyatChange={(v) => handleInputChange("akhir_ayat", v)}
                disabled={!formData.surat}
              />

              <ScoreSelectGroup
                kelancaran={formData.kelancaran}
                tajwid={formData.tajwid}
                tahsin={formData.tahsin}
                onKelancaranChange={(value) => handleInputChange("kelancaran", value)}
                onTajwidChange={(value) => handleInputChange("tajwid", value)}
                onTahsinChange={(value) => handleInputChange("tahsin", value)}
              />

              <div className="space-y-2">
                <Label htmlFor="catatan" className="text-white font-medium">
                  Catatan
                </Label>
                <Textarea
                  id="catatan"
                  placeholder="Masukkan catatan (opsional)"
                  value={formData.catatan}
                  onChange={(e) => handleInputChange("catatan", e.target.value)}
                  className="bg-white bg-opacity-20 border border-emerald-300 text-white placeholder:text-white/70 focus:border-emerald-400"
                  rows={3}
                />
              </div>

              <AddSetoranExaminerInput
                diujiOleh={formData.diuji_oleh}
                onDiujiOlehChange={(value) => handleInputChange("diuji_oleh", value)}
              />

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={createSetoranMutation.isPending}
              >
                {createSetoranMutation.isPending ? "Menambahkan..." : "Tambah Setoran"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddSetoran;

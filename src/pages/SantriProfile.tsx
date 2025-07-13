
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SantriProfileInfo from "@/components/santri-profile/SantriProfileInfo";
import SantriProfileAchievement from "@/components/santri-profile/SantriProfileAchievement";
import SantriProfileSetoranTable from "@/components/santri-profile/SantriProfileSetoranTable";
import SantriProfileChart from "@/components/santri-profile/SantriProfileChart";
import { fetchSantriById } from "@/services/supabase/santri.service";
import { fetchSetoranBySantri } from "@/services/supabase/setoran.service";
import { Setoran } from "@/types";

const SantriProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: santri, isLoading: santriLoading, error: santriError } = useQuery({
    queryKey: ['santri', id],
    queryFn: () => fetchSantriById(id!),
    enabled: !!id,
  });

  const { data: rawSetorans = [], isLoading: setoranLoading } = useQuery({
    queryKey: ['setoran', id],
    queryFn: () => fetchSetoranBySantri(id!),
    enabled: !!id,
  });

  // Transform the data to ensure proper typing
  const setorans: Setoran[] = React.useMemo(() => {
    return rawSetorans.map((setoran: any) => ({
      ...setoran,
      catatan: setoran.catatan || ""
    }));
  }, [rawSetorans]);

  if (santriLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-lg text-emerald-600">Memuat profil santri...</span>
          </div>
        </div>
      </div>
    );
  }

  if (santriError || !santri) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Santri tidak ditemukan</h2>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/dashboard')} 
            variant="outline" 
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">
            Profil Santri
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Santri Info & Achievement */}
          <div className="space-y-6">
            <SantriProfileInfo santri={santri} />
            <SantriProfileAchievement santri={santri} setorans={setorans} />
          </div>

          {/* Right Column - Chart & Table */}
          <div className="lg:col-span-2 space-y-6">
            <SantriProfileChart setorans={setorans} />
            <SantriProfileSetoranTable setorans={setorans} isLoading={setoranLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SantriProfile;

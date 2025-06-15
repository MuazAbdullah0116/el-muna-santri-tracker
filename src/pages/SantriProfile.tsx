
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SantriProfileInfo from "@/components/santri-profile/SantriProfileInfo";
import SantriProfileChart from "@/components/santri-profile/SantriProfileChart";
import SantriProfileSetoranTable from "@/components/santri-profile/SantriProfileSetoranTable";
import SantriProfileAchievement from "@/components/santri-profile/SantriProfileAchievement";
import { fetchSantriById } from "@/services/supabase/santri.service";
import { fetchSetoranBySantri } from "@/services/supabase/setoran.service";

const SantriProfile = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: santri,
    isLoading: isLoadingSantri,
    error: santriError,
  } = useQuery({
    queryKey: ["santri", id],
    queryFn: () => fetchSantriById(id!),
    enabled: !!id,
  });

  const {
    data: setoran = [],
    isLoading: isLoadingSetoran,
  } = useQuery({
    queryKey: ["setoran", id],
    queryFn: () => fetchSetoranBySantri(id!),
    enabled: !!id,
  });

  if (isLoadingSantri) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (santriError || !santri) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
          <CardContent className="p-6">
            <p className="text-red-600">Santri tidak ditemukan</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-emerald-800 text-center">
              Profil Santri
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SantriProfileInfo santri={santri} />
            <div className="mt-6">
              <SantriProfileAchievement santri={santri} setorans={setoran} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <SantriProfileChart
              setorans={setoran}
              isLoading={isLoadingSetoran}
            />

            <Separator />

            <SantriProfileSetoranTable
              setorans={setoran}
              isLoading={isLoadingSetoran}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SantriProfile;

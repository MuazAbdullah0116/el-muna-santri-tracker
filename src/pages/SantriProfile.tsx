
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus } from "lucide-react";
import SantriProfileInfo from "@/components/santri-profile/SantriProfileInfo";
import SantriProfileChart from "@/components/santri-profile/SantriProfileChart";
import SantriProfileSetoranTable from "@/components/santri-profile/SantriProfileSetoranTable";
import SantriProfileAchievement from "@/components/santri-profile/SantriProfileAchievement";
import EditSantriDialog from "@/components/santri-profile/EditSantriDialog";
import DeleteSantriDialog from "@/components/santri-profile/DeleteSantriDialog";
import { fetchSantriById } from "@/services/supabase/santri.service";
import { fetchSetoranBySantri } from "@/services/supabase/setoran.service";

const SantriProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <span className="text-emerald-600 font-medium">Memuat profil santri...</span>
        </div>
      </div>
    );
  }

  if (santriError || !santri) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 font-medium">Santri tidak ditemukan</p>
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="mt-4 bg-emerald-600 hover:bg-emerald-700"
            >
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/70 backdrop-blur-sm border-emerald-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/dashboard")}
                  className="hover:bg-emerald-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-2xl font-bold text-emerald-800">
                  Profil Santri
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <EditSantriDialog santri={santri} />
                <DeleteSantriDialog santri={santri} />
                <Button
                  onClick={() => navigate(`/add-setoran/${santri.id}`)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Setoran
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info & Achievements */}
          <div className="lg:col-span-1 space-y-6">
            <SantriProfileInfo santri={santri} />
            <SantriProfileAchievement santri={santri} setorans={setoran} />
          </div>

          {/* Right Column - Charts & Tables */}
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

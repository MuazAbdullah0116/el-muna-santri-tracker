
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Santri, Setoran } from "@/types";
import { fetchSantriById, fetchSetoranBySantri } from "@/services/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SantriProfileInfo from "@/components/santri-profile/SantriProfileInfo";
import SantriProfileChart from "@/components/santri-profile/SantriProfileChart";
import SantriProfileSetoranTable from "@/components/santri-profile/SantriProfileSetoranTable";
import SantriProfileAchievement from "@/components/santri-profile/SantriProfileAchievement";

const SantriProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [santri, setSantri] = useState<Santri | null>(null);
  const [setorans, setSetorans] = useState<Setoran[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSantri = async () => {
      setLoading(true);
      if (!id) return;
      try {
        const data = await fetchSantriById(id);
        setSantri(data);
        if (data) {
          const setoranData = await fetchSetoranBySantri(data.id);
          setSetorans(setoranData);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    loadSantri();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[30vh]">
        <div className="spinner-border animate-spin w-10 h-10 border-4 border-islamic-primary rounded-full border-t-transparent mb-4"></div>
        <div className="text-muted-foreground">Memuat profil santri...</div>
      </div>
    );
  }
  if (!santri) {
    return (
      <div className="text-center py-10 text-lg text-muted-foreground">
        Santri tidak ditemukan.
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-2xl p-2 md:p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-3">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali
      </Button>
      <Card>
        <CardContent className="py-6 flex flex-col gap-6">
          <SantriProfileInfo santri={santri} />
          <SantriProfileAchievement santri={santri} setorans={setorans} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-6 flex flex-col gap-6">
          <SantriProfileChart setorans={setorans} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-6 flex flex-col gap-4">
          <SantriProfileSetoranTable setorans={setorans} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SantriProfile;

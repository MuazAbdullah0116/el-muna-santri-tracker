
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import IslamicLogo from "@/components/IslamicLogo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-islamic-pattern">
      <div className="text-center">
        <IslamicLogo size="md" />
        <h1 className="mt-6 text-3xl font-bold">Halaman Tidak Ditemukan</h1>
        <p className="mt-2 text-muted-foreground">
          Maaf, halaman yang Anda cari tidak tersedia
        </p>
        <Button 
          onClick={() => navigate("/")} 
          className="mt-6"
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

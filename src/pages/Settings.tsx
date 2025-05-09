
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import IslamicLogo from "@/components/IslamicLogo";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="islamic-card">
        <CardHeader>
          <CardTitle>Setelan</CardTitle>
          <CardDescription>Konfigurasi aplikasi sesuai kebutuhan Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme-mode">Mode Gelap</Label>
              <p className="text-sm text-muted-foreground">
                Ubah tampilan aplikasi ke mode gelap atau terang
              </p>
            </div>
            <Switch
              id="theme-mode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="usage">
              <AccordionTrigger>Panduan Penggunaan</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Santri dan Setoran</h4>
                  <p className="text-sm text-muted-foreground">
                    Anda dapat menambahkan santri baru melalui tombol "Tambah Santri" di Dashboard. 
                    Untuk setiap santri, Anda bisa menambahkan data setoran hafalan dengan klik nama 
                    santri kemudian "Tambah Setoran".
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Al-Quran Digital</h4>
                  <p className="text-sm text-muted-foreground">
                    Halaman Al-Quran Digital berisi seluruh surat dalam Al-Quran. Klik salah 
                    satu surat untuk membaca ayat-ayatnya. Anda juga dapat menggunakan fitur 
                    pencarian dan navigasi ayat.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Prestasi Santri</h4>
                  <p className="text-sm text-muted-foreground">
                    Lihat peringkat santri berdasarkan jumlah hafalan, nilai rata-rata, dan 
                    keteraturan setoran. Anda dapat memfilter berdasarkan jenis kelamin dan 
                    mencari santri tertentu.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="about">
              <AccordionTrigger>Tentang Aplikasi</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="text-center">
                  <IslamicLogo size="md" />
                  <h3 className="font-medium mt-4">Pengelola Setoran Santri</h3>
                  <p className="text-sm text-muted-foreground">
                    Pondok Pesantren Al-Munawwarah
                  </p>
                  <p className="text-sm mt-2">
                    Versi 1.0
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    Dikembangkan oleh Rusn Creator<br/>
                    © 2025 All rights reserved
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        
        {user && user !== "Wali" && (
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              Keluar
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Settings;

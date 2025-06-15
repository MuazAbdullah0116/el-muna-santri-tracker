import { useState } from "react";
import { Settings as SettingsIcon, Database, Palette, Users, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ThemeSettings from "@/components/settings/ThemeSettings";
import IslamicLogo from "@/components/IslamicLogo";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari aplikasi",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-4 md:space-y-6 p-3 md:p-6">
        {/* Header Section */}
        <div className="bg-card rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-border">
          <div className="flex items-center gap-3 md:gap-6">
            {/* Logo and Icon */}
            <div className="flex items-center gap-3 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-islamic-primary to-islamic-secondary flex items-center justify-center shadow-xl">
                <SettingsIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              {/* Logo Pondok */}
              <div className="hidden sm:block">
                <IslamicLogo size="md" animated />
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">Pengaturan</h1>
              <p className="text-sm md:text-lg text-muted-foreground">Kelola pengaturan aplikasi</p>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-card rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[500px] bg-background border border-border rounded-xl">
              <TabsTrigger value="general" className="flex items-center gap-2 text-foreground data-[state=active]:bg-islamic-primary data-[state=active]:text-white">
                <SettingsIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Umum</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2 text-foreground data-[state=active]:bg-islamic-primary data-[state=active]:text-white">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Tampilan</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2 text-foreground data-[state=active]:bg-islamic-primary data-[state=active]:text-white">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Pengguna</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              {/* Account Section - Show only if user is logged in */}
              {user && user !== "Wali" && (
                <Card className="bg-card border border-border text-foreground">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-islamic-primary">
                      <LogOut className="w-5 h-5" />
                      Akun
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Kelola akun dan sesi login Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-islamic-light/10 rounded-lg border border-islamic-primary/20">
                      <div>
                        <p className="font-medium text-foreground">Status Login</p>
                        <p className="text-sm text-muted-foreground">
                          Masuk sebagai: <span className="font-semibold text-islamic-primary">{user}</span>
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-card border border-border text-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-islamic-primary">
                    <Database className="w-5 h-5" />
                    Informasi Aplikasi
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Detail aplikasi manajemen santri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Logo for mobile */}
                  <div className="sm:hidden flex justify-center mb-2">
                    <IslamicLogo size="md" animated />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Versi Aplikasi</label>
                      <p className="text-lg font-semibold text-foreground">1.0.0</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Database</label>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500 text-white border-green-600 shadow-none">
                          Google Sheets
                        </Badge>
                        <span className="text-sm text-muted-foreground">Terhubung</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <h4 className="font-medium mb-2 text-foreground">Fitur Tersedia:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <Badge variant="outline" className="text-foreground border-border bg-background">Manajemen Santri</Badge>
                      <Badge variant="outline" className="text-foreground border-border bg-background">Setoran Hafalan</Badge>
                      <Badge variant="outline" className="text-foreground border-border bg-background">Laporan Progress</Badge>
                      <Badge variant="outline" className="text-foreground border-border bg-background">Filter & Pencarian</Badge>
                      <Badge variant="outline" className="text-foreground border-border bg-background">Prestasi Santri</Badge>
                      <Badge variant="outline" className="text-foreground border-border bg-background">Responsive Design</Badge>
                    </div>
                  </div>
                  {/* Developer credit */}
                  <div className="pt-4 text-right">
                    <span className="text-xs md:text-sm text-muted-foreground">
                      Developer: <span className="font-semibold text-islamic-primary">Visual Acr Studio</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <ThemeSettings />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card className="bg-card border border-border text-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-islamic-secondary">
                    <Users className="w-5 h-5" />
                    Manajemen Pengguna
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Kelola pengguna dan hak akses (fitur dalam pengembangan)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Fitur manajemen pengguna akan tersedia pada versi mendatang</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;

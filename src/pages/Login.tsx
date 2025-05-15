
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings, Trash2, Edit } from "lucide-react";
import IslamicLogo from "@/components/IslamicLogo";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminTools, setShowAdminTools] = useState(false);
  const { login, skipLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: "Login berhasil",
          description: `Selamat datang, ${username}!`,
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login gagal",
          description: "Username atau password salah",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Silakan coba lagi nanti",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipLogin = () => {
    skipLogin();
    navigate("/quran");
  };

  const toggleAdminTools = () => {
    setShowAdminTools(!showAdminTools);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-islamic-pattern">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <IslamicLogo size="md" />
          <h1 className="mt-4 text-2xl font-semibold">Pengelola Setoran Santri</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pondok Pesantren Al-Munawwarah
          </p>
        </div>
        
        <Card className="islamic-card">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Masuk sebagai tim pondok atau lewati sebagai wali
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="mt-2">
                  {isLoading ? "Memproses..." : "Login"}
                </Button>
              </div>
            </form>

            {(username === "Asatidz" || username === "Musyrif") && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={toggleAdminTools}
                  className="flex items-center text-sm text-muted-foreground hover:text-primary"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  {showAdminTools ? 'Sembunyikan Tools Admin' : 'Tampilkan Tools Admin'}
                </button>
                
                {showAdminTools && (
                  <div className="mt-4 space-y-4">
                    <Separator />
                    <div className="text-sm font-medium">Tools Admin</div>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        variant="outline"
                        className="flex items-center justify-start"
                        onClick={() => navigate("/edit-setoran")}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Setoran
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center justify-start"
                        onClick={() => navigate("/delete-setoran")}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus Riwayat Setoran
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={handleSkipLogin}>
              Lewati sebagai Wali Santri
            </Button>
          </CardFooter>
        </Card>
        
        <p className="mt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Rusn Creator. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;

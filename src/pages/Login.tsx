
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import IslamicLogo from "@/components/IslamicLogo";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-islamic-light via-background to-islamic-primary/10">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <IslamicLogo size="md" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-islamic-dark">
              Pengelola Setoran Santri
            </h1>
            <p className="text-sm text-muted-foreground">
              Pondok Pesantren Al-Munawwarah
            </p>
          </div>
        </div>
        
        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-4">
            <CardTitle className="text-xl text-islamic-dark">Login</CardTitle>
            <CardDescription className="text-sm">
              Masuk sebagai tim pondok atau lewati sebagai wali
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-11 bg-islamic-primary hover:bg-islamic-primary/90 text-white font-medium"
              >
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="pt-2">
            <Button 
              variant="outline" 
              onClick={handleSkipLogin}
              className="w-full h-11 border-islamic-primary text-islamic-primary hover:bg-islamic-primary/5"
            >
              Lewati sebagai Wali Santri
            </Button>
          </CardFooter>
        </Card>
        
        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Rusn Creator. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

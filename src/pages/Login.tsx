
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background dark:bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <IslamicLogo size="md" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Pengelola Setoran Santri
            </h1>
            <p className="text-sm text-muted-foreground">
              Pondok Pesantren Al-Munawwarah
            </p>
          </div>
        </div>
        
        {/* Login Card */}
        <Card className="shadow-xl border bg-card/90 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-4">
            <CardTitle className="text-xl text-foreground">Login</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Masuk sebagai tim pondok atau lewati sebagai wali
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
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
                <Label htmlFor="password">Password</Label>
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
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition"
              >
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="pt-2">
            <Button 
              variant="outline" 
              onClick={handleSkipLogin}
              className="w-full h-11 border-primary text-primary hover:bg-primary/10 hover:text-primary"
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

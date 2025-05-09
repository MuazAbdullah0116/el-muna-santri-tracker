
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IslamicLogo from "@/components/IslamicLogo";
import { useAuth } from "@/context/auth-context";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        if (user === "Wali") {
          navigate("/quran");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/login");
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate, user]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="animate-fade-in flex flex-col items-center">
        <IslamicLogo size="lg" animated />
        <h1 className="mt-6 text-3xl font-bold text-islamic-dark dark:text-islamic-light">
          Pengelola Setoran Santri
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pondok Pesantren Al-Munawwarah
        </p>
        <div className="mt-8 flex items-center animate-pulse">
          <div className="h-2 w-2 rounded-full bg-islamic-primary mr-1"></div>
          <div className="h-2 w-2 rounded-full bg-islamic-primary mr-1"></div>
          <div className="h-2 w-2 rounded-full bg-islamic-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

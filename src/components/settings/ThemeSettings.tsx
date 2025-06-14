
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";

const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      value: "light",
      label: "Terang",
      description: "Mode terang untuk penggunaan siang hari",
      icon: Sun,
    },
    {
      value: "dark", 
      label: "Gelap",
      description: "Mode gelap untuk penggunaan malam hari",
      icon: Moon,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-islamic-primary">
          <Sun className="w-5 h-5" />
          Pengaturan Tema
        </CardTitle>
        <CardDescription>
          Pilih tema yang sesuai dengan preferensi Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((themeOption) => {
            const IconComponent = themeOption.icon;
            const isActive = theme === themeOption.value;
            
            return (
              <div
                key={themeOption.value}
                className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 cursor-pointer group ${
                  isActive 
                    ? "border-islamic-primary bg-islamic-primary/5" 
                    : "border-border hover:border-islamic-primary/50 bg-card"
                }`}
                onClick={() => setTheme(themeOption.value as "light" | "dark")}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive 
                        ? "bg-islamic-primary text-white" 
                        : "bg-muted text-muted-foreground group-hover:bg-islamic-primary/10 group-hover:text-islamic-primary"
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{themeOption.label}</h3>
                        {isActive && (
                          <Badge className="bg-islamic-primary text-white text-xs px-2 py-0.5">
                            Aktif
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {themeOption.description}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={`w-full ${
                      isActive 
                        ? "bg-islamic-primary hover:bg-islamic-primary/90" 
                        : "hover:bg-islamic-primary hover:text-white"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTheme(themeOption.value as "light" | "dark");
                    }}
                  >
                    {isActive ? "Tema Aktif" : "Pilih Tema"}
                  </Button>
                </div>
                
                {isActive && (
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-islamic-primary" />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="text-sm text-muted-foreground bg-islamic-light/20 p-3 rounded-lg">
          <p className="font-medium mb-1">Catatan Tema:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Tema akan tersimpan secara otomatis di browser</li>
            <li>Mode gelap membantu mengurangi kelelahan mata</li>
            <li>Semua warna Islamic tetap konsisten di kedua tema</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;

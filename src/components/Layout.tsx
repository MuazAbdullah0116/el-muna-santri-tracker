
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Trophy, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated and trying to access restricted pages
    const restrictedPaths = ["/dashboard", "/add-santri"];
    const currentPath = location.pathname;
    const isAddSetoranPath = currentPath.includes("/add-setoran");
    
    if (!user && (restrictedPaths.includes(currentPath) || isAddSetoranPath)) {
      navigate("/login");
    }
  }, [user, location.pathname, navigate]);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      adminOnly: true,
    },
    {
      name: "Al-Quran",
      path: "/quran",
      icon: <BookOpen className="h-5 w-5" />,
      adminOnly: false,
    },
    {
      name: "Prestasi",
      path: "/achievements",
      icon: <Trophy className="h-5 w-5" />,
      adminOnly: false,
    },
    {
      name: "Setelan",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
      adminOnly: false,
    },
  ];

  const filteredNavItems = navItems.filter((item) => !item.adminOnly || isAuthenticated);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-card">
              <nav className="grid gap-6 py-6">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-semibold px-3">Menu</h3>
                  {filteredNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground",
                        location.pathname === item.path && 
                        "bg-accent text-accent-foreground font-medium"
                      )}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex items-center justify-center md:justify-start">
            <h1 className="text-base md:text-lg font-semibold">
              Pengelola Santri Al-Munawwarah
            </h1>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary text-primary-foreground">
              {user || "Guest"}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container py-6">
        {children}
      </main>

      {/* Bottom navigation for mobile */}
      <nav className="md:hidden sticky bottom-0 border-t border-border/40 bg-background flex justify-around py-2">
        {filteredNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center py-1 px-3 text-muted-foreground",
              location.pathname === item.path && "text-primary font-medium"
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Side navigation for desktop */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full p-4 flex-col gap-4 bg-sidebar text-sidebar-foreground border-r border-border/40">
        <div className="py-6 flex items-center justify-center">
          <h2 className="font-bold text-lg">Al-M</h2>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors",
                location.pathname === item.path
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/20"
              )}
            >
              {item.icon}
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;


import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Trophy, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

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
    <SidebarProvider defaultOpen={false}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsible="icon">
          <SidebarContent className="py-4">
            <div className="mb-6 px-3">
              <h2 className="font-bold text-lg text-center">Al-M</h2>
            </div>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.name}
                    isActive={location.pathname === item.path}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </div>

      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center">
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
        <main className="flex-1 container py-6 pb-20 md:pb-6">
          {children}
        </main>

        {/* Bottom navigation for mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex justify-around py-2">
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
          </div>
        </nav>
      </div>
    </SidebarProvider>
  );
};

export default Layout;

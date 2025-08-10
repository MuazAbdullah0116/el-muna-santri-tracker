
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Users, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import IslamicLogo from "@/components/IslamicLogo";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

import SantriSearch from "./navbar/SantriSearch";

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { label: "Dashboard", path: "/", icon: Home },
    { label: "Santri", path: "/santri", icon: Users },
    { label: "Tambah Setoran", path: "/add-setoran", icon: Plus },
    { label: "Jelajah Santri", path: "/browse-santri", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-dark-primary via-islamic-dark-secondary to-islamic-dark-accent">
      {/* Header */}
      <header className="bg-gradient-to-r from-islamic-dark-primary/95 to-islamic-dark-secondary/95 backdrop-blur-sm shadow-lg border-b border-islamic-dark-accent/20 sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-12 sm:h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <IslamicLogo size="sm" />
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-xl font-bold text-white">
                  Sistem Setoran
                </h1>
                <p className="text-xs text-white/80 hidden md:block">
                  Al-Munawwarah
                </p>
              </div>
            </div>

            {/* Center - Santri Search */}
            <div className="hidden md:flex flex-1 justify-center max-w-md mx-4">
              <SantriSearch />
            </div>

            {/* Navigation and Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Mobile Santri Search */}
              <div className="md:hidden">
                <SantriSearch />
              </div>

              <ThemeToggle />
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white hover:bg-white/10"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    size="sm"
                    asChild
                    className={cn(
                      "text-white hover:bg-white/10 transition-colors text-sm px-3",
                      location.pathname === item.path && "bg-white/20"
                    )}
                  >
                    <Link to={item.path} className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-2">
              <nav className="flex flex-col space-y-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    size="sm"
                    asChild
                    className={cn(
                      "text-white hover:bg-white/10 justify-start text-sm px-3",
                      location.pathname === item.path && "bg-white/20"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to={item.path} className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-islamic-dark-primary/95 to-islamic-dark-secondary/95 backdrop-blur-sm border-t border-islamic-dark-accent/20 z-50 md:hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "text-white hover:bg-white/10 flex flex-col items-center justify-center space-y-1",
                  location.pathname === item.path && "bg-white/20"
                )}
              >
                <Link to={item.path} className="flex flex-col items-center justify-center space-y-1">
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;

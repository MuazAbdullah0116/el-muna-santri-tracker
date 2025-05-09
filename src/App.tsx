
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddSantri from "./pages/AddSantri";
import AddSetoran from "./pages/AddSetoran";
import QuranDigital from "./pages/QuranDigital";
import SurahDetail from "./pages/SurahDetail";
import Achievements from "./pages/Achievements";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/add-santri" element={<Layout><AddSantri /></Layout>} />
              <Route path="/add-setoran/:santriId" element={<Layout><AddSetoran /></Layout>} />
              <Route path="/quran" element={<Layout><QuranDigital /></Layout>} />
              <Route path="/quran/:surahNumber" element={<Layout><SurahDetail /></Layout>} />
              <Route path="/achievements" element={<Layout><Achievements /></Layout>} />
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

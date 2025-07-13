import { useState, useEffect } from "react";
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
import BrowseSantri from "./pages/BrowseSantri";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import QuranAudioPlayer from "./components/QuranAudioPlayer";
import SantriProfile from "./pages/SantriProfile";

const queryClient = new QueryClient();

const App = () => {
  // Audio state is now in App component, which persists across routes
  const [audioState, setAudioState] = useState({
    audioUrl: null as string | null,
    surahName: '',
    isPlaying: false
  });

  // Audio element reference
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Set up audio element when URL changes
  useEffect(() => {
    if (audioState.audioUrl) {
      const audio = new Audio(audioState.audioUrl);
      audio.addEventListener("ended", () => {
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      });
      
      setAudioElement(audio);
      
      // Cleanup
      return () => {
        audio.pause();
        audio.remove();
      };
    } else {
      if (audioElement) {
        audioElement.pause();
        audioElement.remove();
        setAudioElement(null);
      }
    }
  }, [audioState.audioUrl]);

  // Handle play/pause when isPlaying changes
  useEffect(() => {
    if (audioElement) {
      if (audioState.isPlaying) {
        audioElement.play().catch(error => {
          console.error("Error playing audio:", error);
          setAudioState(prev => ({ ...prev, isPlaying: false }));
        });
      } else {
        audioElement.pause();
      }
    }
  }, [audioState.isPlaying, audioElement]);

  // Global audio player controls
  const handleTogglePlay = () => {
    setAudioState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleCloseAudio = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    setAudioState({ audioUrl: null, surahName: '', isPlaying: false });
  };

  // Make audio state available globally
  useEffect(() => {
    window.setQuranAudio = (audioUrl, surahName, isPlaying) => {
      if (audioUrl === null) {
        // Only clear audio if explicitly asked to
        if (surahName === '') {
          setAudioState({ audioUrl: null, surahName: '', isPlaying: false });
        }
      } else {
        // If setting new audio
        setAudioState({ audioUrl, surahName, isPlaying });
      }
    };
    
    return () => {
      // Cleanup
      window.setQuranAudio = () => {};
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/browse" element={<BrowseSantri />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/add-santri" element={<Layout><AddSantri /></Layout>} />
                <Route path="/add-setoran/:santriId" element={<Layout><AddSetoran /></Layout>} />
                <Route path="/quran" element={<Layout><QuranDigital /></Layout>} />
                <Route path="/quran/:surahNumber" element={<Layout><SurahDetail /></Layout>} />
                <Route path="/achievements" element={<Layout><Achievements /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="/santri/:id" element={<Layout><SantriProfile /></Layout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <QuranAudioPlayer 
              audioUrl={audioState.audioUrl} 
              surahName={audioState.surahName} 
              isPlaying={audioState.isPlaying}
              onTogglePlay={handleTogglePlay}
              onClose={handleCloseAudio}
            />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

// Add to global window
declare global {
  interface Window {
    setQuranAudio: (audioUrl: string | null, surahName: string, isPlaying: boolean) => void;
  }
}

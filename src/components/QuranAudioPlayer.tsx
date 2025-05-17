
import { useState, useEffect } from "react";
import { Play, Pause, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuranAudioPlayerProps {
  audioUrl: string | null;
  surahName: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

const QuranAudioPlayer = ({ audioUrl, surahName, isPlaying, onTogglePlay, onClose }: QuranAudioPlayerProps) => {
  // Don't render anything if there's no audio
  if (!audioUrl) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b py-2 px-4 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
      <div className="flex items-center gap-3">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onTogglePlay} 
          className="h-8 w-8 p-0 rounded-full"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {surahName} <span className="text-xs text-muted-foreground">
              {isPlaying ? "Sedang diputar" : "Dijeda"}
            </span>
          </p>
        </div>
      </div>
      
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={onClose} 
        className="h-8 w-8 p-0 rounded-full"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuranAudioPlayer;

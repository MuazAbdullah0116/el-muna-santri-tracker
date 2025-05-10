
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
  if (!audioUrl) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border rounded-lg shadow-lg p-3 flex items-center gap-3 max-w-xs animate-in fade-in slide-in-from-bottom-5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{surahName}</p>
        <p className="text-xs text-muted-foreground">
          {isPlaying ? "Sedang diputar" : "Dijeda"}
        </p>
      </div>
      
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={onTogglePlay} 
        className="h-8 w-8 p-0 rounded-full"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
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

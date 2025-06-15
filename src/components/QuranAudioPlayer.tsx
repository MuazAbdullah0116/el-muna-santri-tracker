
import { useEffect, useRef, useState } from "react";
import { Play, Pause, X, Volume2, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface QuranAudioPlayerProps {
  audioUrl: string | null;
  surahName: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

const QuranAudioPlayer = ({
  audioUrl,
  surahName,
  isPlaying,
  onTogglePlay,
  onClose,
}: QuranAudioPlayerProps) => {
  // ----- Audio & Progress State -----
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  // Update audioRef when audioUrl changes
  useEffect(() => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
      } else {
        audioRef.current = new Audio(audioUrl);
      }
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setDuration(0);
      audioRef.current.addEventListener("loadedmetadata", handleMetadata);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("ended", () => setCurrentTime(duration));

      // Jangan fungsi play/pause otomatis di sini! Pusat logika tetap di App

      return () => {
        audioRef.current?.pause();
        audioRef.current?.removeEventListener("loadedmetadata", handleMetadata);
        audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
    // eslint-disable-next-line
  }, [audioUrl]);

  // Ikuti progress waktu jika user play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handleMetadata = () => {
    const audio = audioRef.current;
    setDuration(audio?.duration || 0);
  };

  const handleTimeUpdate = () => {
    if (!seeking) {
      setCurrentTime(audioRef.current?.currentTime || 0);
    }
  };

  // Slider action: user seek
  const handleSeek = (value: number[]) => {
    setSeeking(true);
    setCurrentTime(value[0]);
  };
  const handleSeekCommit = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
    setSeeking(false);
  };

  // Helper to format seconds -> mm:ss
  const formatTime = (s: number) => {
    if (isNaN(s)) return "00:00";
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Don't render if tak ada audio
  if (!audioUrl) return null;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-4 z-[999] max-w-md w-[96vw] sm:w-[400px] shadow-2xl rounded-2xl border border-islamic-primary bg-gradient-to-br from-white/95 via-islamic-light/95 to-islamic-primary/10 dark:from-card dark:via-card dark:to-islamic-dark/60 px-4 py-3 animate-in fade-in slide-in-from-bottom-4 transition-all">
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="ghost"
          onClick={onTogglePlay}
          className="h-10 w-10 rounded-full border border-islamic-primary/30 hover:bg-islamic-primary/20 flex-shrink-0"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-islamic-primary" />
          ) : (
            <Play className="h-6 w-6 text-islamic-primary" />
          )}
        </Button>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <Music2 className="h-5 w-5 text-islamic-primary shrink-0" />
            <span className="truncate font-medium text-sm text-islamic-primary">{surahName}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {isPlaying ? "Sedang diputar" : "Dijeda"}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="h-9 w-9 p-0 rounded-full ml-2"
          aria-label="Tutup"
        >
          <X className="h-5 w-5 text-islamic-primary" />
        </Button>
      </div>
      {/* Progress + Time */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[11px] text-muted-foreground w-11 text-right tabular-nums">{formatTime(currentTime)}</span>
        <Slider
          min={0}
          max={duration || 1}
          value={[currentTime]}
          step={1}
          onValueChange={handleSeek}
          onValueCommit={handleSeekCommit}
          className="flex-1 mx-2"
          aria-label="Audio progress"
        />
        <span className="text-[11px] text-muted-foreground w-11 text-left tabular-nums">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default QuranAudioPlayer;


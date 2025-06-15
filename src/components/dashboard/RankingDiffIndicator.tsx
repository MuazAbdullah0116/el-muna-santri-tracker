
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

type Props = {
  diff: number; // -1: turun, 0: tetap, 1: naik
};

const RankingDiffIndicator: React.FC<Props> = ({ diff }) => {
  if (diff > 0) {
    return (
      <span className="flex items-center gap-0.5 text-green-600 text-xs md:text-sm font-bold">
        <ArrowUp className="w-3 h-3 md:w-4 md:h-4" />
        <span className="hidden md:inline">Naik</span>
      </span>
    );
  }
  if (diff < 0) {
    return (
      <span className="flex items-center gap-0.5 text-red-500 text-xs md:text-sm font-bold">
        <ArrowDown className="w-3 h-3 md:w-4 md:h-4" />
        <span className="hidden md:inline">Turun</span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-muted-foreground text-xs md:text-sm">
      <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
      <span className="hidden md:inline">Tetap</span>
    </span>
  );
};

export default RankingDiffIndicator;

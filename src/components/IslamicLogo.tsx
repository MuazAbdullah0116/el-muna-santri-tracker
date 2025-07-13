
import React from "react";

interface IslamicLogoProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const IslamicLogo: React.FC<IslamicLogoProps> = ({ 
  size = "md", 
  animated = false 
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${animated ? "animate-pulse" : ""}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-islamic-primary"
      >
        {/* Mosque dome */}
        <circle cx="50" cy="45" r="25" fill="currentColor" opacity="0.8" />
        
        {/* Minaret */}
        <rect x="45" y="15" width="10" height="35" fill="currentColor" />
        <circle cx="50" cy="15" r="3" fill="currentColor" />
        
        {/* Base structure */}
        <rect x="20" y="60" width="60" height="25" fill="currentColor" opacity="0.6" />
        
        {/* Arabic calligraphy style decoration */}
        <path
          d="M35 50 Q50 40 65 50"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

export default IslamicLogo;

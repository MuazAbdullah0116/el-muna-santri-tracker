
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
    <div className={`relative ${sizeClasses[size]}`}>
      <div className={`absolute inset-0 flex items-center justify-center ${animated ? "animate-pulse-slow" : ""}`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full text-islamic-primary"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50,5 A45,45 0 1,1 5,50 A45,45 0 1,1 95,50 A45,45 0 1,1 50,5 z M50,15 A35,35 0 1,0 85,50 A35,35 0 1,0 15,50 A35,35 0 1,0 50,15 z" />
          <path d="M50,25 L55,40 H70 L60,50 L65,65 L50,55 L35,65 L40,50 L30,40 H45 z" />
        </svg>
      </div>
      <div className={`absolute inset-0 flex items-center justify-center ${animated ? "animate-pulse-slow" : ""}`}>
        <span className="text-islamic-gold font-semibold text-center">
          {size === "sm" && "Al-M"}
          {size === "md" && "Al-Muna"}
          {size === "lg" && "Al-Munawwarah"}
        </span>
      </div>
    </div>
  );
};

export default IslamicLogo;
